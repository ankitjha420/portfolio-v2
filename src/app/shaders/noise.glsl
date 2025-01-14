#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SPEED .5

precision highp float;

// Uniforms
uniform vec2 uResolution;
uniform float uTime;

// Functions
vec2 adjustViewport(vec2 coord, vec2 res) {
    return (coord * 2.0 - res) / (res.x < res.y ? res.x : res.y);
}

mat2 rot2(in float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float fold(in float x) {
    return abs(mod(x + 1.0, 2.0) - 1.0);
}

vec2 fold(in vec2 p) {
    return vec2(fold(p.x), fold(p.y));
}

float cosine(in float x, in float s) {
    float y = cos(fract(x) * PI);
    return floor(x) + 0.5 - (0.5 * pow(abs(y), 1.0 / s) * sign(y));
}

vec2 cosine(in vec2 p, in float s) {
    return vec2(cosine(p.x, s), cosine(p.y, s));
}

vec3 cosine(in vec3 p, in float s) {
    return vec3(cosine(p.xy, s), cosine(p.z, s));
}

float scale(in float x, in float a, in float b, in float c, in float d) {
    return (x - a) / (b - a) * (d - c) + c;
}

vec3 gradient(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(TWO_PI * (c * t + d));
}

// Constants
vec3 c1 = vec3(0.212);
vec3 c2 = vec3(0.3);
vec3 c3 = vec3(2.6);
vec3 c4 = vec3(0.212, 0.212, 0.212);

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = adjustViewport(fragCoord, uResolution);
    float t = uTime * SPEED;
    t += cosine(t * 0.25, 2.0);
    uv *= 5.0;
    vec2 p = uv;
    vec2 q = 1.0 - uv;
    float a = 0.5;
    vec3 col = vec3(0.0);

    for (float i = 1.0; i < 5.0; i++) {
        float s = pow(1.3, i);
        float an = -a - cos(a * 0.5 + t) * 0.125;
        mat2 m = rot2(an);
        p *= m;
        q *= m;
        a += dot(cos(q + t + i - a) / s, vec2(0.25));
        vec2 k = fold(q - t - a + s);
        float h = scale(sin(a + t * 1.5), -1.0, 1.0, 0.5, 0.75);
        q = mix(q, k, h);
        vec2 tmp = q;
        q = p;
        p = tmp;
        q *= 2.0;
        float w = a;
        col += gradient(
        a * 0.5 + t * 0.3 + i,
        vec3(0.212, 0.212, 0.212),
        vec3(0.788, 0.788, 0.788),
        vec3(0.5, 0.5, 0.5),
        vec3(0.0, 0.0, 0.0)
        ) * w;
    }

    col = cosine(col, 1.5);
    col = mix(vec3(0.212), vec3(.5), col);

    float opacity = 0.5; // value between 0.0 and 1.0
    col *= opacity;

    gl_FragColor = vec4(col, opacity);
}