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

int main(int argc, char* argv[])
{
    if (argc < 2 || argc > 3) {
        std::cerr << "Usage: stepinfo <file.step> [output.obj]\n";
        return 1;
    }

    const std::string filename = argv[1];
    const std::string objFilename =
        (argc == 3) ? argv[2] : "output.obj";

    std::cout << "Navorika STEP Prototype\n";
    std::cout << "=======================\n";
    std::cout << "File: " << filename << "\n\n";

    STEPControl_Reader reader;

    IFSelect_ReturnStatus status = reader.ReadFile(filename.c_str());

    if (status != IFSelect_RetDone) {
        std::cerr << "ERROR: Unable to read STEP file.\n";
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
        std::cerr << "ERROR: Tessellation failed.\n";
        return 5;
    }

    long long triangles = 0;
    long long meshNodes = 0;
    int meshedFaces = 0;

    std::ofstream obj(objFilename);

    if (!obj.is_open()) {
        std::cerr << "ERROR: Cannot create OBJ file.\n";
        return 6;
    }

    obj << "# Navorika STEP to OBJ prototype\n";
    obj << "# Source: " << filename << "\n\n";

    long long vertexOffset = 1;

    for (TopExp_Explorer ex(shape, TopAbs_FACE); ex.More(); ex.Next()) {

        const TopoDS_Face face = TopoDS::Face(ex.Current());

        TopLoc_Location location;
        Handle(Poly_Triangulation) triangulation =
            BRep_Tool::Triangulation(face, location);

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

            Poly_Triangle triangle =
                triangulation->Triangle(i);

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

    Bnd_Box box;
    BRepBndLib::Add(shape, box);

    Standard_Real xmin, ymin, zmin, xmax, ymax, zmax;
    box.Get(xmin, ymin, zmin, xmax, ymax, zmax);

    const double xSize = xmax - xmin;
    const double ySize = ymax - ymin;
    const double zSize = zmax - zmin;

    std::cout << "STEP import:       SUCCESS\n";
    std::cout << "Transfer roots:    " << roots << "\n\n";

    std::cout << "CAD topology\n";
    std::cout << "------------\n";
    std::cout << "Solids:            " << solids << "\n";
    std::cout << "Faces:             " << faces << "\n";
    std::cout << "Edges:             " << edges << "\n";
    std::cout << "Vertices:          " << vertices << "\n\n";

    std::cout << "Tessellation\n";
    std::cout << "------------\n";
    std::cout << "Meshed faces:      " << meshedFaces << "\n";
    std::cout << "Mesh nodes:        " << meshNodes << "\n";
    std::cout << "Triangles:         " << triangles << "\n";
    std::cout << "Status:            SUCCESS\n\n";

    std::cout << std::fixed << std::setprecision(3);

    std::cout << "Bounding dimensions\n";
    std::cout << "-------------------\n";
    std::cout << "X:                 " << xSize << "\n";
    std::cout << "Y:                 " << ySize << "\n";
    std::cout << "Z:                 " << zSize << "\n\n";

    std::cout << "OBJ export:        SUCCESS\n";
    std::cout << "OBJ file:          " << objFilename << "\n\n";

    std::cout << "Navorika STEP engine test: PASS\n";

    return 0;
}
