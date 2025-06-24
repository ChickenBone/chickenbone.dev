precision mediump float;

varying vec2 vUv;
uniform sampler2D u_scene;
uniform vec2 u_resolution;
uniform float u_blur_radius;

void main() {
    vec2 pixel = u_blur_radius / u_resolution;
    vec4 col = vec4(0.0);

    // 9-tap box blur
    col += texture2D(u_scene, vUv + vec2(-pixel.x, -pixel.y));
    col += texture2D(u_scene, vUv + vec2(-pixel.x, 0.0));
    col += texture2D(u_scene, vUv + vec2(-pixel.x, pixel.y));
    col += texture2D(u_scene, vUv + vec2(0.0, -pixel.y));
    col += texture2D(u_scene, vUv + vec2(0.0, 0.0));
    col += texture2D(u_scene, vUv + vec2(0.0, pixel.y));
    col += texture2D(u_scene, vUv + vec2(pixel.x, -pixel.y));
    col += texture2D(u_scene, vUv + vec2(pixel.x, 0.0));
    col += texture2D(u_scene, vUv + vec2(pixel.x, pixel.y));

    col /= 9.0;

    // Add a "frosted glass" effect
    float noise = (fract(sin(dot(vUv, vec2(12.9898,78.233)))*43758.5453) - 0.5) * 0.1; // small noise
    vec3 final_color = col.rgb + noise;

    // Apply a semi-transparent overlay
    gl_FragColor = vec4(final_color, 0.85);
}
