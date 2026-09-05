cmake_minimum_required(VERSION 3.16)

project(navorika_step_to_obj LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenCASCADE REQUIRED)

add_executable(step-to-obj step-to-obj.cpp)

target_include_directories(step-to-obj PRIVATE
    ${OpenCASCADE_INCLUDE_DIR}
)

target_link_libraries(step-to-obj PRIVATE
    TKernel
    TKMath
    TKG2d
    TKG3d
    TKBRep
    TKGeomBase
    TKGeomAlgo
    TKTopAlgo
    TKMesh
    TKXSBase
    TKSTEPBase
    TKSTEPAttr
    TKSTEP209
    TKSTEP
)
