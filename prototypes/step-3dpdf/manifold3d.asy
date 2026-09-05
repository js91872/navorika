settings.outformat="pdf";
settings.prc=true;
settings.render=2;

import three;
import obj;

size(500);

currentprojection=perspective(
    camera=(180,180,140),
    up=Z,
    target=(57,57,42)
);

obj model = obj(
    "build/pump-manifold.obj",
    true,
    lightgray
);

draw(model);
