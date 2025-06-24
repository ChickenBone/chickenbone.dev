precision mediump float;

varying vec2 vUv;
uniform float u_time;
uniform float u_seed;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Generate a pastel color from a seed
vec3 pastelColor(float seed) {
    float hue = fract(seed / 1000.0);
    float sat = 0.5 + 0.2 * rand(vec2(seed, seed + 1.0)); // pastel: low saturation
    float val = 0.85 + 0.1 * rand(vec2(seed + 2.0, seed + 3.0)); // pastel: high value

    // HSV to RGB
    float c = val * sat;
    float x = c * (1.0 - abs(mod(hue * 6.0, 2.0) - 1.0));
    float m = val - c;
    vec3 rgb;
    if (hue < 1.0/6.0) rgb = vec3(c, x, 0.0);
    else if (hue < 2.0/6.0) rgb = vec3(x, c, 0.0);
    else if (hue < 3.0/6.0) rgb = vec3(0.0, c, x);
    else if (hue < 4.0/6.0) rgb = vec3(0.0, x, c);
    else if (hue < 5.0/6.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);
    return rgb + m;
}

void main() {
    vec2 uv = vUv;

    // Use seed to create unique movement
    float seed_x = rand(vec2(u_seed, u_seed * 2.0));
    float seed_y = rand(vec2(u_seed * 3.0, u_seed * 4.0));

    // Bouncing logic
    vec2 speed = vec2(0.1 + seed_x * 0.2, 0.07 + seed_y * 0.2); // random speed
    float timeX = u_time * speed.x + seed_x * 10.0; // random start position
    float timeY = u_time * speed.y + seed_y * 10.0; // random start position

    float posX = mod(timeX, 1.0);
    float posY = mod(timeY, 1.0);

    if (floor(mod(timeX, 2.0)) == 1.0) {
        posX = 1.0 - posX;
    }
    if (floor(mod(timeY, 2.0)) == 1.0) {
        posY = 1.0 - posY;
    }

    vec2 pos = vec2(posX, posY);
    float radius = 0.3 + rand(vec2(u_seed, u_seed)) * 0.8; // random radius

    float d = distance(uv, pos);

    if (d > radius) {
        discard;
    }

    gl_FragColor = vec4(pastelColor(u_seed), 1.0 - (d/radius));
}
