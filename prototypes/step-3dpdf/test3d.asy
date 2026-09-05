settings.outformat="pdf";
settings.prc=true;
settings.render=2;

import three;

size(300);

currentprojection=perspective(
    camera=(4,3,2),
    up=Z,
    target=O
);

draw(unitcube, surfacepen=lightblue+opacity(0.9));
