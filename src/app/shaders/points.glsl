uniform sampler2D trailTexture;
uniform float fade;
varying vec2 vUv;

void main() {
    vec4 texel = texture2D(trailTexture, vUv);
    gl_FragColor = vec4(texel.rgb * fade, texel.a * fade);
}