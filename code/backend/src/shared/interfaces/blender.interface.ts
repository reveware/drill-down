
export namespace Blender  {
    export interface Camera {
        lens: {
            type: 'perspective' | 'ortographic'
            focalLength: number; // units mm
            depthOfField?: {
                distance: number;
                focalTarget: object;
            }
        }
    }

    export interface Light {
        type: 'point' | 'spot' | 'area' | 'sun'
        power: number;
        color: string;
        radius: number;

    }
    export interface EnvironmentDescription {
        camera: Camera
        objects: object[],
        lighting: Light[],
        describedBy: string
    }

    export interface Render {
        url: string;
        themes: string[];
        shaders: Shader[]
        environment: EnvironmentDescription

    }

    export interface Shader { 
        alias: 'toon' | 'b&w' | 'realism' // you get the idea,
        distorsion: number;
        foggyness: number;

    }
    
    export interface Asset {
        name: string;
        fileType: string;
    }
}