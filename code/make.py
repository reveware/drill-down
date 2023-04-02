import bpy
import os
import time
import logging
from math import radians


class MakeSomethingPrettyOperator(bpy.types.Operator):
    """Tooltip"""
    bl_idname = "object.make_something_pretty"
    bl_label = "Make something pretty"
    bl_options = {'REGISTER', 'UNDO'}
    
    log = logging.getLogger(__name__)

    noise_scale: bpy.props.FloatProperty(
        name = "Noise Scale",
        description = "The scale for the noise texture",
        default = 0.0001,
        min = 0.0,
        max = 2.0
    )

    output_path = './render'

    def getRenderOutputFilePath(self, name):
        fileName =  'render_%s.jpg'  % name
        outputDirectory = os.path.join(output_path, fileName)
        return outputDirectory

    def getFbxExportOutputFilePath(self, name):
        fileName = 'character_%s.fbx' % name
        outputDirectory = os.path.join(output_path, fileName)
        return fileName

    
    def addSubDivisionModifier(self, obj, levels):
        sub_div_modifier = obj.modifiers.new("SUBSERF_MOD", "SUBSURF")
        sub_div_modifier.levels = levels
        sub_div_modifier.render_levels = levels

        
    def addDisplacementModifier(self, obj):
        displacemenet_modifier = obj.modifiers.new("DISPLACE_MOD", "DISPLACE")

        # Create the texture for displacement
        cloud_texture = bpy.data.textures.new("CLOUD_TEXTURE", "CLOUDS")
        cloud_texture.noise_scale = self.noise_scale

        displacemenet_modifier.texture = cloud_texture

    
    def createGlowingMaterial(self, color, strength):
        glowingMaterial = bpy.data.materials.new(name= "Glowing Color")
        glowingMaterial.use_nodes = True

        nodes = glowingMaterial.node_tree.nodes 

        emission_shader = nodes.new(type="ShaderNodeEmission")
        # inputs[n] represents the input nodes of the Node, for emission (0 = color, 1 = strenght)
        emission_shader.inputs[0].default_value = (color)
        emission_shader.inputs[1].default_value = strength
        
        material_output = nodes.get("Material Output")

        links = glowingMaterial.node_tree.links
        # this creates a link between the first output, and the first material output input
        links.new(emission_shader.outputs[0], material_output.inputs[0])
        
        return glowingMaterial
        

    def execute(self, context):    

        time_start = time.time()

        # Set render preferences
        bpy.context.scene.render.engine = 'BLENDER_EEVEE'
        bpy.context.scene.eevee.use_bloom = True
        bpy.context.scene.eevee.bloom_intensity = 0.066

        # Delete everything from scene
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False, confirm=False)
        
        # Create a cube & Tag it
        bpy.ops.mesh.primitive_cube_add()
        selected_object = bpy.context.active_object
        selected_object.name = 'PrettyThing'

        # Rotate 
        selected_object.rotation_euler[0] += radians(45)
        
        # Shade smooth
        bpy.ops.object.shade_smooth()

        self.addSubDivisionModifier(selected_object, 3)
        
        self.addDisplacementModifier(selected_object)

        red_color = (1, 0, 0.0185058, 1)
        
        glowing_red_material = self.createGlowingMaterial(red_color, 10)

        selected_object.data.materials.append(glowing_red_material)
        
        # Add Camera
        camera_location = (5.2, -2.3, 2.8)
        camera_rotation = (radians(63.5), radians(0.76), radians(65.5))
        bpy.ops.object.camera_add(enter_editmode=False, align='VIEW', location=(camera_location), rotation=(camera_rotation), scale=(1, 1, 1))
        bpy.context.scene.camera = bpy.context.object
        
        self.log.info('context otbject: %s' % bpy.context.object.name)


        # TODO: improve the command arguments to flag this
        
        # Render Images (frames)
    #    render_file_path = self.getRenderOutputFilePath('something_pretty');
     #   bpy.context.scene.render.filepath = render_file_path
      #  bpy.ops.render.render(animation=False, write_still=True, use_viewport=False, layer='', scene='')

        # Export to FBX
    #    bpy.data.objects['PrettyThing'].select_set(True)
     #   fbx_file_path = self.getFbxExportOutputFilePath('something_pretty')
      #  bpy.ops.export_scene.fbx(filepath = fbx_file_path, use_selection = True)
        
        time_end = time.time()

        self.log.info('Finished rendering something pretty, took : %.4f' % (time_end - time_start))
        return {'FINISHED'}

def menu_func(self, context):
    self.layout.operator(MakeSomethingPrettyOperator.bl_idname, text=MakeSomethingPrettyOperator.bl_label)

# Register and add to the "object" menu (required to also use F3 search "Make Something Pretty Operator" for quick access)
def register():
    bpy.utils.register_class(MakeSomethingPrettyOperator)
    bpy.types.VIEW3D_MT_object.append(menu_func)


def unregister():
    bpy.utils.unregister_class(MakeSomethingPrettyOperator)
    bpy.types.VIEW3D_MT_object.remove(menu_func)


if __name__ == "__main__":
    register()
    bpy.ops.object.make_something_pretty()
