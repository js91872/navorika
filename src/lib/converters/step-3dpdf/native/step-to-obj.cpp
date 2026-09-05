#include <STEPControl_Reader.hxx>
#include <IFSelect_ReturnStatus.hxx>
#include <TopoDS_Shape.hxx>
#include <TopoDS_Face.hxx>
#include <TopExp_Explorer.hxx>
#include <TopAbs_ShapeEnum.hxx>
#include <BRepMesh_IncrementalMesh.hxx>
#include <BRep_Tool.hxx>
#include <TopoDS.hxx>
#include <Poly_Triangulation.hxx>
#include <TopLoc_Location.hxx>
#include <Bnd_Box.hxx>
#include <BRepBndLib.hxx>
#include <gp_Pnt.hxx>
#include <gp_Trsf.hxx>

#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#include <cmath>

int main(int argc, char* argv[])
{
    if (argc < 2 || argc > 3) {
        std::cerr << "Usage: step-to-obj <input.step> [output.obj]\n";
        return 1;
    }

    const std::string inputFilename = argv[1];
    const std::string outputFilename = (argc == 3) ? argv[2] : "output.obj";

    STEPControl_Reader reader;
    const IFSelect_ReturnStatus status = reader.ReadFile(inputFilename.c_str());

    if (status != IFSelect_RetDone) {
        std::cerr << "ERROR: Unable to read STEP file: " << inputFilename << "\n";
        return 2;
    }

    const Standard_Integer roots = reader.NbRootsForTransfer();
    if (roots <= 0) {
        std::cerr << "ERROR: STEP file contains no transferable roots.\n";
        return 3;
    }

    reader.TransferRoots();
    TopoDS_Shape shape = reader.OneShape();

    if (shape.IsNull()) {
        std::cerr << "ERROR: STEP transfer produced an empty shape.\n";
        return 4;
    }

    int solids = 0;
    int faces = 0;
    int edges = 0;
    int vertices = 0;

    for (TopExp_Explorer ex(shape, TopAbs_SOLID); ex.More(); ex.Next())
        ++solids;

    for (TopExp_Explorer ex(shape, TopAbs_FACE); ex.More(); ex.Next())
        ++faces;

    for (TopExp_Explorer ex(shape, TopAbs_EDGE); ex.More(); ex.Next())
        ++edges;

    for (TopExp_Explorer ex(shape, TopAbs_VERTEX); ex.More(); ex.Next())
        ++vertices;

    if (faces == 0) {
        std::cerr << "ERROR: STEP model contains zero topological faces.\n";
        return 7;
    }

    const double linearDeflection = 0.1;
    const double angularDeflection = 0.5;

    BRepMesh_IncrementalMesh mesher(
        shape,
        linearDeflection,
        Standard_False,
        angularDeflection,
        Standard_True
    );

    if (!mesher.IsDone()) {
        std::cerr << "ERROR: B-Rep tessellation failed.\n";
        return 5;
    }

    long long triangles = 0;
    long long meshNodes = 0;
    int meshedFaces = 0;

    std::ofstream obj(outputFilename);
    if (!obj.is_open()) {
        std::cerr << "ERROR: Cannot create output OBJ file: " << outputFilename << "\n";
        return 6;
    }

    obj << "# Navorika STEP to OBJ Converter\n";
    obj << "# Source: " << inputFilename << "\n\n";

    long long vertexOffset = 1;

    for (TopExp_Explorer ex(shape, TopAbs_FACE); ex.More(); ex.Next()) {
        const TopoDS_Face face = TopoDS::Face(ex.Current());

        TopLoc_Location location;
        Handle(Poly_Triangulation) triangulation = BRep_Tool::Triangulation(face, location);

        if (triangulation.IsNull())
            continue;

        ++meshedFaces;
        const gp_Trsf transform = location.Transformation();

        for (int i = 1; i <= triangulation->NbNodes(); ++i) {
            gp_Pnt p = triangulation->Node(i);
            p.Transform(transform);

            obj << std::fixed << std::setprecision(6)
                << "v "
                << p.X() << " "
                << p.Y() << " "
                << p.Z() << "\n";
        }

        for (int i = 1; i <= triangulation->NbTriangles(); ++i) {
            Poly_Triangle triangle = triangulation->Triangle(i);

            Standard_Integer n1, n2, n3;
            triangle.Get(n1, n2, n3);

            if (face.Orientation() == TopAbs_REVERSED)
                std::swap(n2, n3);

            obj << "f "
                << (vertexOffset + n1 - 1) << " "
                << (vertexOffset + n2 - 1) << " "
                << (vertexOffset + n3 - 1) << "\n";
        }

        triangles += triangulation->NbTriangles();
        meshNodes += triangulation->NbNodes();
        vertexOffset += triangulation->NbNodes();
    }

    obj.close();

    if (triangles == 0) {
        std::cerr << "ERROR: Tessellation yielded zero triangles.\n";
        return 7;
    }

    Bnd_Box box;
    BRepBndLib::Add(shape, box);

    Standard_Real xmin, ymin, zmin, xmax, ymax, zmax;
    box.Get(xmin, ymin, zmin, xmax, ymax, zmax);

    const double dx = xmax - xmin;
    const double dy = ymax - ymin;
    const double dz = zmax - zmin;

    const double cx = (xmin + xmax) / 2.0;
    const double cy = (ymin + ymax) / 2.0;
    const double cz = (zmin + zmax) / 2.0;

    const double diag = std::sqrt(dx * dx + dy * dy + dz * dz);

    // Diagnostics to stderr
    std::cerr << "STEP import successful. Faces: " << faces << ", Triangles: " << triangles << "\n";

    // Structured JSON metadata to stdout
    std::cout << std::fixed << std::setprecision(6);
    std::cout << "{\n"
              << "  \"success\": true,\n"
              << "  \"solids\": " << solids << ",\n"
              << "  \"faces\": " << faces << ",\n"
              << "  \"edges\": " << edges << ",\n"
              << "  \"vertices\": " << vertices << ",\n"
              << "  \"meshedFaces\": " << meshedFaces << ",\n"
              << "  \"meshNodes\": " << meshNodes << ",\n"
              << "  \"triangles\": " << triangles << ",\n"
              << "  \"bbox\": {\n"
              << "    \"min\": [" << xmin << ", " << ymin << ", " << zmin << "],\n"
              << "    \"max\": [" << xmax << ", " << ymax << ", " << zmax << "],\n"
              << "    \"center\": [" << cx << ", " << cy << ", " << cz << "],\n"
              << "    \"dimensions\": [" << dx << ", " << dy << ", " << dz << "],\n"
              << "    \"diagonal\": " << diag << "\n"
              << "  }\n"
              << "}\n";

    return 0;
}
