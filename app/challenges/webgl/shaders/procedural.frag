#version 300 es

precision highp float;
precision mediump int;
precision mediump sampler3D;

in vec2 uv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uRotationOffset;
uniform vec2 uResolution;
uniform sampler3D uNoiseTexture;
uniform float uQuality;
uniform int uSelectedPlanet;
uniform int uHoveredPlanet;
uniform vec3 uPlanetPositions[6];
uniform int uChallengeCount;
uniform vec3 uCameraPosition;
uniform vec3 uCameraDirection;

const float ROTATION_SPEED = .1;

const vec3 SUN_COLOR = vec3(1.0, 1.0, 0.9);
const vec3 DEEP_SPACE = vec3(0., 0., 0.001);
const vec3 SPACE_HIGHLIGHT = vec3(.6, .3, .9);
const vec3 SUN_DIRECTION = normalize(vec3(1., 1., 1.8));
const float SUN_INTENSITY = 3.;
const float AMBIENT_LIGHT = .01;

const float EPSILON = 1e-3;
const float INFINITY = 1e10;

const float PI = acos(-1.);

struct Moon {
  float radius;
  float rotationSpeed;
  vec3 offset;
};

const Moon none = Moon(INFINITY, 0., vec3(0.));

struct Planet {
  vec3 waterColorDeep;
  vec3 waterColorSurface;
  vec3 sandColor;
  vec3 treeColor;
  vec3 rockColor;
  vec3 iceColor;
  vec3 cloudColor;
  float waterSurfaceLevel;
  float sandLevel;
  float treeLevel;
  float rockLevel;
  float iceLevel;
  float transition;
  float radius;
  float cloudsDensity;
  float cloudsScale;
  float cloudsSpeed;
  float terrainScale;
  float noiseStrength;
  vec3 atmosphereColor;
  float atmosphereDensity;
  Moon moons[4];
  int moonCount;
};

const Moon arvon = Moon(
  .08,
  -ROTATION_SPEED * 5.,
  vec3(2.4, .5, 0.)
);
const Moon krelln = Moon(
  .16,
  -ROTATION_SPEED * 2.,
  vec3(4.8, -.66, 0.)
);

const Planet arrakis = Planet(
  vec3(.75, .28, .08), // waterColorDeep
  vec3(.75, .3, .1), // waterColorSurface
  vec3(.75, .33, .14), // sandColor
  vec3(.75, .4, .2), // treeColor
  vec3(.75, .43, .24), // rockColor
  vec3(.8, .9, .9), // iceColor
  vec3(.75, .3, .1), // cloudColor
  .02, // waterSurfaceLevel
  .028, // sandLevel
  .03, // treeLevel
  .13, // rockLevel
  10., // iceLevel
  .02, // transition
  2., // radius
  .6, // cloudsDensity
  1., // cloudsScale
  1.5, // cloudsSpeed
  .2, // terrainScale
  .3, // noiseStrength
  vec3(.8, .2, .03), // atmosphereColor
  .3, // atmosphereDensity
  Moon[4](arvon, krelln, none, none), // moons
  2 // moonCount
);

const Moon caladanMoon = Moon(
  .2,
  -ROTATION_SPEED * 2.,
  vec3(-6., -1., 0.)
);

const Planet caladan = Planet(
  vec3(.01, .05, .15), // waterColorDeep
  vec3(.02, .12, .27), // waterColorSurface
  vec3(1., .7, .85), // sandColor
  vec3(.02, .1, .06), // treeColor
  vec3(.15, .12, .12), // rockColor
  vec3(.8, .9, .9), // iceColor
  vec3(1., 1., 1.), // cloudColor
  0., // waterSurfaceLevel
  .028, // sandLevel
  .03, // treeLevel
  .1, // rockLevel
  .15, // iceLevel
  .02, // transition
  4.16, // radius
  .5, // cloudsDensity
  1., // cloudsScale
  1.5, // cloudsSpeed
  .3, // terrainScale
  .2, // noiseStrength
  vec3(.05, .3, .9), // atmosphereColor
  .3, // atmosphereDensity
  Moon[4](caladanMoon, none, none, none), // moons
  1 // moonCount
);

const Planet giediPrime = Planet(
  vec3(.04, .04, .04), // waterColorDeep
  vec3(.2, .1, .06), // waterColorSurface
  vec3(.15, .15, .15), // sandColor
  vec3(.05, .05, .05), // treeColor
  vec3(.0, .0, .0), // rockColor
  vec3(.4, .01, 0.), // iceColor
  vec3(0., 0., 0.), // cloudColor
  .005, // waterSurfaceLevel
  .01, // sandLevel
  .03, // treeLevel
  .14, // rockLevel
  .15, // iceLevel
  .03, // transition
  5.37, // radius
  1., // cloudsDensity
  1., // cloudsScale
  1.5, // cloudsSpeed
  .4, // terrainScale
  .2, // noiseStrength
  vec3(.2, .1, .05), // atmosphereColor
  .1, // atmosphereDensity
  Moon[4](none, none, none, none), // moons
  0 // moonCount
);

const Planet tleilax = Planet(
  vec3(.01, .05, .15), // waterColorDeep
  vec3(.6, .6, .6), // waterColorSurface
  vec3(.4, .4, .4), // sandColor
  vec3(.2, .2, .2), // treeColor
  vec3(.13, .13, .13), // rockColor
  vec3(.08, .08, .08), // iceColor
  vec3(.8, .8, .8), // cloudColor
  0., // waterSurfaceLevel
  .028, // sandLevel
  .03, // treeLevel
  .1, // rockLevel
  .16, // iceLevel
  .02, // transition
  4., // radius
  2., // cloudsDensity
  1., // cloudsScale
  1.5, // cloudsSpeed
  .2, // terrainScale
  .3, // noiseStrength
  vec3(.3, .3, .3), // atmosphereColor
  .3, // atmosphereDensity
  Moon[4](none, none, none, none), // moons
  0 // moonCount
);

const Planet salusaSecundus = Planet(
  vec3(.02, .01, .01), // waterColorDeep
  vec3(.02, .01, .01), // waterColorSurface
  vec3(.12, .12, .12), // sandColor
  vec3(.15, .15, .15), // treeColor
  vec3(.06, .05, .05), // rockColor
  vec3(.1, .09, .09), // iceColor
  vec3(.6, .5, .4), // cloudColor
  0., // waterSurfaceLevel
  .028, // sandLevel
  .03, // treeLevel
  .1, // rockLevel
  .15, // iceLevel
  .02, // transition
  3., // radius
  0., // cloudsDensity
  1., // cloudsScale
  1.5, // cloudsSpeed
  .6, // terrainScale
  .8, // noiseStrength
  vec3(.35, .3, .3), // atmosphereColor
  .3, // atmosphereDensity
  Moon[4](none, none, none, none), // moons
  0 // moonCount
);

const Moon kaitainMoon1 = Moon(
  .1,
  -ROTATION_SPEED * 4.,
  vec3(-5.3, 0., 0.)
);
const Moon kaitainMoon2 = Moon(
  .25,
  -ROTATION_SPEED * 3.,
  vec3(6.2, -1., 0.)
);
const Moon kaitainMoon3 = Moon(
  .2,
  -ROTATION_SPEED * 2.,
  vec3(-6.5, .66, 1.)
);
const Moon kaitainMoon4 = Moon(
  .3,
  -ROTATION_SPEED * 5.,
  vec3(7., -.33, -1.)
);

const Planet kaitain = Planet(
  vec3(.01, .08, .2), // waterColorDeep
  vec3(.02, .4, .4), // waterColorSurface
  vec3(.55, .4, .55), // sandColor
  vec3(.15, .3, .06), // treeColor
  vec3(.19, .34, .1), // rockColor
  vec3(.23, .38, .14), // iceColor
  vec3(1., 1., 1.), // cloudColor
  .02, // waterSurfaceLevel
  .028, // sandLevel
  .03, // treeLevel
  .1, // rockLevel
  .15, // iceLevel
  .02, // transition
  5., // radius
  .4, // cloudsDensity
  .7, // cloudsScale
  1.5, // cloudsSpeed
  .3, // terrainScale
  .22, // noiseStrength
  vec3(.7, .8, .4), // atmosphereColor
  .1, // atmosphereDensity
  Moon[4](kaitainMoon1, kaitainMoon2, kaitainMoon3, kaitainMoon4), // moons
  4 // moonCount
);

const Planet planets[6] = Planet[6](arrakis, caladan, giediPrime, tleilax, salusaSecundus, kaitain);

const vec3 challengePoints[8] = vec3[8](
  vec3(sin(1.2) * cos(0.2), cos(1.2), sin(1.2) * sin(0.2)),
  vec3(sin(1.1) * cos(-0.4), cos(1.1), sin(1.1) * sin(-0.4)),
  vec3(sin(0.6) * cos(1.6), cos(0.6), sin(0.6) * sin(1.6)),
  vec3(sin(0.8) * cos(-1.7), cos(0.8), sin(0.8) * sin(-1.7)),
  vec3(sin(1.) * cos(1.7), cos(1.), sin(1.) * sin(1.7)),
  vec3(sin(0.8) * cos(2.7), cos(0.8), sin(0.8) * sin(2.7)),
  vec3(sin(0.7) * cos(-2.9), cos(0.7), sin(0.7) * sin(-2.9)),
  vec3(sin(1.2) * cos(-2.4), cos(1.2), sin(1.2) * sin(-2.4))
);

struct Material {
  vec4 color;
  float diffuse;
  float specular;
};

struct Hit {
  float len;
  vec3 normal;
  Material material;
};

Hit miss = Hit(INFINITY, vec3(0.), Material(vec4(1.), -1., -1.));

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float noise(vec3 p) {
  return texture(uNoiseTexture, p * .05).r;
}

// https://iquilezles.org/articles/intersectors/
float sphIntersect(vec3 ro, vec3 rd, vec3 ce, float ra) {
  vec3 oc = ro - ce;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - ra * ra;
  float h = b * b - c;
  if (h < 0.0)
    return -1.; // no intersection
  return -b - sqrt(h);
}

// https://iquilezles.org/articles/intersectors/
float plaIntersect(vec3 ro, vec3 rd, vec4 p) {
    return -(dot(ro, p.xyz) + p.w) / dot(rd,p.xyz);
}

// Comes from a course by SimonDev (https://www.youtube.com/channel/UCEwhtpXrg5MmwlH04ANpL8A)
// https://simondev.teachable.com/p/glsl-shaders-from-scratch
float fbm(vec3 p, int octaves, float persistence, float lacunarity, float exponentiation) {
  float amplitude = 0.5;
  float frequency = 3.0;
  float total = 0.0;
  float normalization = 0.0;
  int qualityDegradation = 2 - int(floor(uQuality)); // 0 when quality=optimal, 2 when quality=low
  int octavesWithQuality = max(octaves - qualityDegradation, 1);

  for (int i = 0; i < octavesWithQuality; ++i) {
    float noiseValue = noise(p * frequency);
    total += noiseValue * amplitude;
    normalization += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  total /= normalization;
  total = total * 0.8 + 0.1;
  total = pow(total, exponentiation);

  return total;
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    vec3(c, 0, s),
    vec3(0, 1, 0),
    vec3(-s, 0, c)
  );
}

mat3 rotateZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    vec3(c, -s, 0),
    vec3(s, c, 0),
    vec3(0, 0, 1)
  );
}

// https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d.glsl
mat3 rotate3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat3(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
  );
}

// nimitz - https://www.shadertoy.com/view/XsyGWV
// I reused the 3D noise texture instead of nimitz's hash function for better performance
vec3 stars(vec3 p) {
  vec3 c = vec3(0.);
  float res = uResolution.x * uQuality * 0.8;

  for (float i = 0.; i < 3.; i++) {
    vec3 q = fract(p * (.15 * res)) - 0.5;
    vec3 id = floor(p * (.15 * res));
    vec2 rn = vec2(noise(id / 2.), noise(id.zyx * 2.)) * .03;
    float c2 = 1. - smoothstep(0., .6, length(q));
    c2 *= step(rn.x, .003 + i * 0.0005);
    c += c2 * (mix(vec3(1.0, 0.49, 0.1), vec3(0.75, 0.9, 1.), rn.y) * 0.25 + 1.2);
    p *= 1.8;
  }
  return c * c;
}

// Comes from a course by SimonDev (https://www.youtube.com/channel/UCEwhtpXrg5MmwlH04ANpL8A)
// https://simondev.teachable.com/p/glsl-shaders-from-scratch
float domainWarpingFBM(vec3 p, int octaves, float persistence, float lacunarity, float exponentiation) {
  vec3 offset = vec3(
    fbm(p, octaves, persistence, lacunarity, exponentiation),
    fbm(p + vec3(43.235, 23.112, 0.0), octaves, persistence, lacunarity, exponentiation),
    0.0
  );

  return fbm(p + 1. * offset, 2, persistence, lacunarity, exponentiation);
}

// Zavie - https://www.shadertoy.com/view/lslGzl
vec3 simpleReinhardToneMapping(vec3 color) {
  float exposure = 1.5;
  color *= exposure / (1. + color / exposure);
  color = pow(color, vec3(1. / 1.4));
  return color;
}

float planetNoise(Planet planet, vec3 p) {
  float fbm = fbm(p * planet.terrainScale, 6, .5, 2., 5.) * planet.noiseStrength;

  // Flatten the noise on the oceans
  return mix(
    fbm / 3. + planet.noiseStrength / 50.,
    fbm,
    smoothstep(planet.sandLevel, planet.sandLevel + planet.transition / 2., fbm * 5.)
  );
}

/**
* Standard ray-sphere intersection but with fbm noise added on the radius.
* Probably not exact (especially near the edges), but it looks good enough
*/
float planetDist(int planetIndex, vec3 ro, vec3 rd) {
  Planet planet = planets[planetIndex];
  vec3 planetPosition = uPlanetPositions[planetIndex];
  float smoothSphereDist = sphIntersect(ro, rd, planetPosition, planet.radius);

  vec3 intersection = ro + smoothSphereDist * rd;
  vec2 rotationAmt = vec2(uTime * ROTATION_SPEED / planet.radius, 0.) + step(float(planetIndex), float(uSelectedPlanet)) * step(float(uSelectedPlanet), float(planetIndex)) * uRotationOffset;
  vec3 intersectionWithRotation = rotate3d(rotateY(PI / 5. + rotationAmt.x) * vec3(0, 0, -1), rotationAmt.y) * rotateY(rotationAmt.x) * (intersection - planetPosition);

  return sphIntersect(ro, rd, planetPosition, planet.radius + planetNoise(planet, intersectionWithRotation));
}

vec3 planetNormal(int planetIndex, vec3 p) {
  Planet planet = planets[planetIndex];
  vec3 rd = uPlanetPositions[planetIndex] - p;
  float dist = planetDist(planetIndex, p, rd);
  // if e is too small it causes artifacts on mobile, so I interpolate 
  // between .01 (large screens) and .03 (small screens)
  vec2 e = vec2(max(.01, .03 * smoothstep(1300., 300., uResolution.x)), 0);

  vec3 normal = dist - vec3(planetDist(planetIndex, p - e.xyy, rd), planetDist(planetIndex, p - e.yxy, rd), planetDist(planetIndex, p - e.yyx, rd));
  return normalize(normal);
}

vec3 moonRotationAxis(int planetIndex, int moonIndex) {
  Planet planet = planets[planetIndex];
  return (planet.moons[moonIndex].offset - uPlanetPositions[planetIndex]) * rotateZ(PI / 2.);
}

vec3 currentMoonPosition(int planetIndex, int moonIndex) {
  Planet planet = planets[planetIndex];
  Moon moon = planet.moons[moonIndex];
  mat3 moonRotation = rotate3d(moonRotationAxis(planetIndex, moonIndex), uTime * moon.rotationSpeed);
  return moon.offset * moonRotation + uPlanetPositions[planetIndex];
}

vec3 spaceColor(vec3 direction) {
  vec3 backgroundCoord = direction;
  float spaceNoise = fbm(backgroundCoord * 3., 4, .5, 2., 6.);

  return stars(backgroundCoord) + mix(DEEP_SPACE, SPACE_HIGHLIGHT / 12., spaceNoise);
}

vec3 atmosphereColor(int planetIndex, vec3 ro, vec3 rd, float spaceMask, Hit firstHit, Hit ringHit) {
  vec3 position = ro + firstHit.len * rd;

  Planet planet = planets[planetIndex];
  vec3 planetPosition = uPlanetPositions[planetIndex];

  float distCameraToPlanetOrigin = length(planetPosition - ro);
  float distCameraToPlanetEdge = sqrt(distCameraToPlanetOrigin * distCameraToPlanetOrigin - planet.radius * planet.radius);

  float satelliteMask = smoothstep(-planet.radius / 2., planet.radius / 2., distCameraToPlanetEdge - firstHit.len);
  float ringMask = step(ringHit.len, distCameraToPlanetEdge) * ringHit.material.color.a;
  float planetMask = 1.0 - spaceMask;

  vec3 coordFromCenter = (ro + rd * distCameraToPlanetEdge) - planetPosition;
  float distFromEdge = abs(length(coordFromCenter) - planet.radius);
  float planetEdge = max(planet.radius - distFromEdge, 0.) / planet.radius;
  float atmosphereMask = pow(remap(dot(SUN_DIRECTION, coordFromCenter), -planet.radius, planet.radius / 2., 0., 1.), 3.);
  atmosphereMask *= planet.atmosphereDensity * planet.radius * SUN_INTENSITY;

  vec3 planetAtmosphere = vec3(0.);
  planetAtmosphere += vec3(pow(planetEdge, 120.)) * .5;
  planetAtmosphere += pow(planetEdge, 50.) * .3 * (1.5 - planetMask);
  planetAtmosphere += pow(planetEdge, 15.) * .03;
  planetAtmosphere += pow(planetEdge, 5.) * .04 * planetMask;
  planetAtmosphere *= planet.atmosphereColor * atmosphereMask * (1.0 - planetMask * min(satelliteMask + ringMask, 1.)) * (1. - smoothstep(planet.radius / 10., planet.radius / 8., distFromEdge));
  return planetAtmosphere;
}

Hit intersectPlanet(int planetIndex, vec3 ro, vec3 rd) {
  Planet planet = planets[planetIndex];
  vec3 planetPosition = uPlanetPositions[planetIndex];
  float len = sphIntersect(ro, rd, planetPosition, planet.radius);

  if (len < 0.) {
    return miss;
  }

  vec3 position = ro + len * rd;
  vec2 rotationAmt = vec2(uTime * ROTATION_SPEED / planet.radius, 0.) + step(float(planetIndex), float(uSelectedPlanet)) * step(float(uSelectedPlanet), float(planetIndex)) * uRotationOffset;
  vec3 rotatedCoord = rotate3d(rotateY(PI / 5. + rotationAmt.x) * vec3(0, 0, -1), rotationAmt.y) * rotateY(rotationAmt.x) * (position - planetPosition);
  float altitude = 5. * planetNoise(planet, rotatedCoord);

  vec3 normal = planetNormal(planetIndex, position);

  vec3 color = mix(planet.waterColorDeep, planet.waterColorSurface, smoothstep(planet.waterSurfaceLevel, planet.waterSurfaceLevel + planet.transition, altitude));
  color = mix(color, planet.sandColor, smoothstep(planet.sandLevel, planet.sandLevel + planet.transition / 2., altitude));
  color = mix(color, planet.treeColor * min(((altitude - planet.treeLevel) / (planet.rockLevel - planet.treeLevel) + .3), 1.), smoothstep(planet.treeLevel, planet.treeLevel + planet.transition, altitude));
  color = mix(color, planet.rockColor, smoothstep(planet.rockLevel, planet.rockLevel + planet.transition, altitude));
  color = mix(color, planet.iceColor, smoothstep(planet.iceLevel, planet.iceLevel + planet.transition, altitude));
  
  vec3 cloudsCoord = (rotatedCoord + vec3(uTime * .008 * planet.cloudsSpeed)) * planet.cloudsScale;
  float cloudsDensity = remap(domainWarpingFBM(cloudsCoord, 3, .3, 5., planet.cloudsScale), -1.0, 1.0, 0.0, 1.0);
  float cloudsThreshold = 1. - planet.cloudsDensity * .5;
  cloudsDensity *= smoothstep(cloudsThreshold, cloudsThreshold + .1, cloudsDensity);
  cloudsDensity *= smoothstep(planet.rockLevel, (planet.rockLevel + planet.treeLevel) / 2., altitude);
  color = mix(color, planet.cloudColor, cloudsDensity);

  if (planetIndex == uSelectedPlanet) {
    for (int j = 0; j < uChallengeCount; j++) {
      float d = distance(challengePoints[j] * planet.radius, rotatedCoord) / planet.radius;
      color = mix(color, vec3(1.) - vec3(0., 1., 1.) * (sin(uTime * 5.) + 4.) / 2., step(d, .01));
      color = mix(color, vec3(1.) - vec3(0., 1., 1.) * (sin(uTime * 5. + 1.) + 4.) / 2., min(1., step(d, .05) * step(.04, d) + step(d, .09) * step(.08, d)));
      color = mix(color, vec3(1.) - vec3(0., 1., 1.) * (sin(uTime * 5. + 2.) + 4.) / 2., min(1., step(d, .09) * step(.08, d)));
    }
  }

  float specular = smoothstep(planet.sandLevel + planet.transition, planet.sandLevel, altitude);

  return Hit(len, normal, Material(vec4(color, 1.), 1., specular));
}

Hit intersectMoon(int planetIndex, vec3 ro, vec3 rd) {
  Hit hit = miss;
  Planet planet = planets[planetIndex];
  vec3 planetPosition = uPlanetPositions[planetIndex];
  for (int i = 0; i < planet.moonCount; i++) {
    Moon moon = planet.moons[i];
    vec3 moonPosition = currentMoonPosition(planetIndex, i);
    float len = sphIntersect(ro, rd, moonPosition, moon.radius);

    if (len < 0.) {
      continue;
    }

    vec3 position = ro + len * rd;
    vec3 originalPosition = (position - planetPosition) * rotate3d(moonRotationAxis(planetIndex, i), -uTime * moon.rotationSpeed);
    vec3 color = vec3(sqrt(fbm(originalPosition * 12., 6, .5, 2., 5.)));
    vec3 normal = normalize(position - moonPosition);

    if (len < hit.len) {
      hit = Hit(len, normal, Material(vec4(color, 1.), 1., 0.));
    }
  }

  return hit;
}

Hit intersectRing(vec3 ro, vec3 rd) {
  vec3 planeParam = normalize(vec3(0.2, 1., 0.5));
  vec3 kaitainPosition = uPlanetPositions[5];
  float len = plaIntersect(ro, rd, vec4(planeParam, -dot(planeParam, kaitainPosition)));
  if (len < 0.) {
    return miss;
  }

  vec3 position = ro + len * rd;
  float l = length(position.xz - kaitainPosition.xz);

  if (l > 7.5 && l < 9.5) {
    float density = 1.2 * clamp(noise(vec3(l * 20.)), 0., 1.) - .2;
    vec3 color = mix(vec3(.42, .3, .2), vec3(.41, .51, .52), abs(noise(vec3(l * 19.)))) * abs(density);
    return Hit(len, planeParam, Material(vec4(color, density), 1., 0.));
  }
  return miss;
}

Hit intersectScene(vec3 ro, vec3 rd) {
  for (int i = 0; i < 6; i++) {
    Hit hit = intersectPlanet(i, ro, rd);
    if (i == uSelectedPlanet) {
      Hit moonHit = intersectMoon(i, ro, rd);

      if (moonHit.len < hit.len) {
        return moonHit;
      }
    }    

    if (hit.len < INFINITY) {
      return hit;
    }
  }

  return miss;
}

vec3 radiance(vec3 ro, vec3 rd) {
  vec3 color = vec3(0.);
  float spaceMask = 1.;
  Hit hit = intersectScene(ro, rd);
  Hit ringHit = intersectRing(ro, rd);

  if (hit.len < INFINITY) {
    spaceMask = 0.;

    vec3 hitPosition = ro + hit.len * rd;
    Hit shadowHit = intersectScene(hitPosition + EPSILON * SUN_DIRECTION, SUN_DIRECTION);
    float hitDirectLight = step(INFINITY, shadowHit.len);

    float directLightIntensity = pow(clamp(dot(hit.normal, SUN_DIRECTION), 0.0, 1.0), 2.) * SUN_INTENSITY; // the power softens the shadow. Not physically accurate but it looks better to me
    vec3 diffuseLight = hitDirectLight * directLightIntensity * SUN_COLOR;
    vec3 diffuseColor = hit.material.color.rgb * (AMBIENT_LIGHT + diffuseLight);

    vec3 reflected = normalize(reflect(SUN_DIRECTION, hit.normal));
    float phongValue = pow(max(0.0, dot(rd, reflected)), 10.) * .01 * SUN_INTENSITY;
    vec3 specularColor = hit.material.specular * vec3(phongValue);

    color = diffuseColor + specularColor;
  } else {
    color = spaceColor(rd);
  }

  if (ringHit.len < hit.len) {
    color = color * (1. - ringHit.material.color.a) + ringHit.material.color.rgb;
    spaceMask = 0.;
  }

  if (uHoveredPlanet != uSelectedPlanet) {
    color += atmosphereColor(uHoveredPlanet, ro, rd, spaceMask, hit, ringHit);
  }
  return color + atmosphereColor(uSelectedPlanet, ro, rd, spaceMask, hit, ringHit);
}

void main() {
  vec3 ro = uCameraPosition;
  vec3 rd = normalize(uCameraDirection + vec3(uv, 0.));

  vec3 color = radiance(ro, rd);

  color = simpleReinhardToneMapping(color);

  color *= 1. - 0.5 * pow(length(uv), 3.);

  fragColor = vec4(color, 1.);
}