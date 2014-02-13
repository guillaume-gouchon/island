
var HeightmapShaders = function (textures) {

    this.vertexShader = [
        'uniform sampler2D bumpTexture;',
        'uniform float bumpScale;',

        'varying float vAmount;',
        'varying vec2 vUV;',

       'void main()',
        '{',
            'vUV = uv;',
            'vec4 bumpData = texture2D( bumpTexture, uv );',
            'vAmount = bumpData.r;',            
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n');



    // init fragment shaders using textures
    this.fragmentShader = '';

    // declare textures uniform variables
    for (var i = 0; i < textures.length; i++) { 
        this.fragmentShader += 'uniform sampler2D ' + textures[i].name + 'Texture' + ';\n'
    }

    this.fragmentShader += [
       'varying vec2 vUV;',
       'varying float vAmount;',

       ' void main() ',
        '{\n'
    ].join('\n');

    var textureSum = '';
    for (var i = 0; i < textures.length; i++) {
        var texture = textures[i];
        this.fragmentShader += 'vec4 ' + texture.name + ' = ( smoothstep(' + texture.params[0] + ', ' + texture.params[1] + ', vAmount)' + (i < textures.length - 1 ? ' - smoothstep(' + texture.params[2] + ', ' + texture.params[3] + ', vAmount) )' : ' )') + ' * texture2D( ' + texture.name + 'Texture' + ', vUV * ' + texture.params[4] + ' );\n'
        textureSum += texture.name + (i < textures.length - 1 ? ' + ' : '');
    }

    this.fragmentShader += 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + ' + textureSum + ';\n}\n';

};
