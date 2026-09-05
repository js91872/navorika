cmake_minimum_required(VERSION 3.16)

project(navorika_stepinfo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenCASCADE REQUIRED)

add_executable(stepinfo main.cpp)

target_include_directories(stepinfo PRIVATE
    ${OpenCASCADE_INCLUDE_DIR}
)

target_link_libraries(stepinfo PRIVATE
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
