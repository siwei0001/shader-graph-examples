"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shadergraph_1 = __importDefault(require("../../shadergraph"));
const type_1 = require("../../type");
const utils_1 = require("../../utils");
function findConnectNodes(slot, nodes) {
    if (!slot.connectSlot)
        return;
    let connectNode = slot.connectSlot.node;
    if (connectNode) {
        if (!nodes.includes(connectNode)) {
            nodes.push(connectNode);
        }
        else {
            return;
        }
        connectNode.inputSlots.forEach(slot => {
            findConnectNodes(slot, nodes);
        });
    }
}
class MasterNode extends base_1.ShaderNode {
    constructor() {
        super(...arguments);
        this.vsSlotIndices = [];
        this.fsSlotIndices = [];
        this.templatePath = '';
        this.isMasterNode = true;
        this.concretePrecisionType = type_1.ConcretePrecisionType.Fixed;
        this.properties = [];
    }
    getConnectNodes(slotIndices) {
        let inputSlots = [];
        slotIndices.forEach(name => {
            let slot = this.getSlotWithSlotName(name);
            if (slot) {
                inputSlots.push(slot);
            }
        });
        let nodes = [];
        inputSlots.forEach(slot => {
            findConnectNodes(slot, nodes);
        });
        nodes.sort((a, b) => b.priority - a.priority);
        return nodes;
    }
    generateVsCode() {
        let code = ['\n'];
        let nodes = this.getConnectNodes(this.vsSlotIndices);
        nodes.forEach(node => {
            node.generateCode().split('\n').forEach(c => {
                code.push('    ' + c);
            });
        });
        return code.join('\n');
    }
    generateFsCode() {
        let code = ['\n'];
        let nodes = this.getConnectNodes(this.fsSlotIndices);
        nodes.forEach(node => {
            node.generateCode().split('\n').forEach(c => {
                c += ` // ${node.constructor.name}`;
                code.push('    ' + c);
            });
        });
        return code.join('\n');
    }
    generatePropertiesCode() {
        let uniform = '\n';
        let mtl = '\n';
        let uniformSampler = '';
        let properties = this.properties;
        properties.sort((a, b) => {
            return b.concretePrecision - a.concretePrecision;
        });
        let blockUniformCount = 0;
        properties.forEach(p => {
            var _a;
            let precision = '';
            let mtlValue = '';
            let value = p.defaultValue;
            let isColor = value.r !== undefined;
            let x = isColor ? value.r : value.x;
            let y = isColor ? value.g : value.y;
            let z = isColor ? value.b : value.z;
            let w = isColor ? value.a : value.w;
            let concretePrecision = (_a = p.node) === null || _a === void 0 ? void 0 : _a.outputSlots[0].concretePrecision;
            if (concretePrecision === 1) {
                precision = 'float';
                mtlValue = `${value}`;
            }
            else if (concretePrecision === 2) {
                precision = 'vec2';
                mtlValue = `[${x}, ${y}]`;
            }
            else if (concretePrecision === 3) {
                precision = 'vec4';
                mtlValue = `[${x}, ${y}, ${z}, 0]`;
            }
            else if (concretePrecision === 4) {
                precision = 'vec4';
                mtlValue = `[${x}, ${y}, ${z},  ${w}]`;
            }
            else if (concretePrecision === type_1.TextureConcretePrecision.Texture2D) {
                precision = 'sampler2D';
                mtlValue = 'white';
            }
            let editorStr = isColor ? `, editor: { type: color }` : '';
            if (concretePrecision < type_1.TextureConcretePrecision.Texture2D) {
                uniform += `    ${precision} ${p.name};\n`;
                blockUniformCount++;
            }
            else {
                uniformSampler += `  uniform ${precision} ${p.name};\n`;
            }
            mtl += `        ${p.name}: { value: ${mtlValue} ${editorStr}}\n`;
        });
        if (blockUniformCount === 0) {
            uniform += '    vec4 empty_value;\n';
        }
        return {
            uniform,
            uniformSampler,
            mtl,
        };
    }
    replaceChunks(code) {
        let depChunks = ['common'];
        let allNodes = shadergraph_1.default.allNodes;
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = 0; j < allNodes[i].length; j++) {
                let node = allNodes[i][j];
                for (let k = 0; k < node.depChunks.length; k++) {
                    if (!depChunks.includes(node.depChunks[k])) {
                        depChunks.push(node.depChunks[k]);
                    }
                }
            }
        }
        let chunkIncludes = '\n';
        let chunks = '\n';
        depChunks.forEach(chunkName => {
            let chunkPath = path_1.default.join(utils_1.shaderTemplatesDir, `chunks/${chunkName}.chunk`);
            let chunk = fs_1.default.readFileSync(chunkPath, 'utf-8');
            if (!chunk) {
                console.error(`Can not find chunk with path [${chunkPath}]`);
                return;
            }
            chunks += chunk + '\n';
            chunkIncludes += `  #include <shader_graph_${chunkName}>\n`;
        });
        code = code.replace('{{chunks}}', chunks);
        code = code.replace('{{vs_chunks}}', chunkIncludes);
        code = code.replace('{{fs_chunks}}', chunkIncludes);
        return code;
    }
    generateVarings(code) {
        let depVarings = [];
        let allNodes = shadergraph_1.default.allNodes;
        allNodes.forEach(nodes => {
            nodes.forEach(node => {
                node.depVarings.forEach(varing => {
                    if (!depVarings.includes(varing)) {
                        depVarings.push(varing);
                    }
                });
            });
        });
        let vs_varing_define = '';
        let vs_varing = '';
        let fs_varing_define = '';
        let fs_varing = '';
        depVarings.forEach(varing => {
            if (varing === 'PositionSpace.Object') {
                vs_varing_define += 'out vec3 v_pos;\n';
                vs_varing += 'v_pos = position.xyz;\n';
                fs_varing_define += 'in vec3 v_pos;\n';
                fs_varing += 'vec4 position = vec4(v_pos, 1.);';
            }
            else if (varing === 'PositionSpace.View') {
                vs_varing_define += 'out vec3 v_viewPos;\n';
                vs_varing += 'v_viewPos = viewPosition.xyz;\n';
                fs_varing_define += 'in vec3 v_viewPos;\n';
                fs_varing += 'vec4 viewPosition = vec4(v_viewPos, 1.);';
            }
            else if (varing === 'PositionSpace.World' || varing === 'PositionSpace.AbsoluteWorld') {
                vs_varing_define += 'out vec3 v_worldPos;\n';
                vs_varing += 'v_worldPos = worldPosition.xyz;\n';
                fs_varing_define += 'in vec3 v_worldPos;\n';
                fs_varing += 'vec4 worldPosition = vec4(v_worldPos, 1.);';
            }
            else if (varing === 'tangent position') {
            }
            else if (varing === 'object normal') {
            }
            else if (varing === 'view normal') {
            }
            else if (varing === 'world normal') {
            }
            else if (varing === 'tangent normal') {
            }
        });
        code = code.replace('{{vs_varing_define}}', vs_varing_define);
        code = code.replace('{{vs_varing}}', vs_varing);
        code = code.replace('{{fs_varing_define}}', fs_varing_define);
        code = code.replace('{{fs_varing}}', fs_varing);
        return code;
    }
    generateCode() {
        let code = fs_1.default.readFileSync(this.templatePath, 'utf-8');
        code = this.generateVarings(code);
        const vsCode = this.generateVsCode();
        const fsCode = this.generateFsCode();
        code = code.replace('{{vs}}', vsCode);
        code = code.replace('{{fs}}', fsCode);
        code = this.replaceChunks(code);
        if (!this.properties || this.properties.length === 0) {
            code = code.replace(/properties: &props/g, '');
            code = code.replace(/properties: \*props/g, '');
        }
        let props = this.generatePropertiesCode();
        code = code.replace('{{properties}}', props.uniform);
        code = code.replace('{{properties_sampler}}', props.uniformSampler);
        code = code.replace('{{properties_mtl}}', props.mtl);
        // old shader graph version do not have vertex slots
        let vertexSlotNames = ['Vertex Position', 'Vertex Normal', 'Vertex Tangent', 'Position'];
        this.inputSlots.forEach(slot => {
            var tempName = `slot_${slot.displayName.replace(/ /g, '_')}`;
            let value;
            if (vertexSlotNames.includes(slot.displayName) || slot.displayName === 'Normal') {
                if (slot.connectSlot) {
                    value = slot.slotValue;
                }
            }
            else {
                value = slot.slotValue;
            }
            let reg = new RegExp(`{{${tempName} *=* *(.*)}}`);
            if (value === undefined) {
                let res = reg.exec(code);
                if (res) {
                    value = res[1];
                }
            }
            code = code.replace(reg, value);
        });
        vertexSlotNames.forEach(name => {
            var tempName = `slot_${name.replace(/ /g, '_')}`;
            let value = '';
            let reg = new RegExp(`{{${tempName} *=* *(.*)}}`);
            let res = reg.exec(code);
            if (res) {
                value = res[1];
            }
            code = code.replace(reg, value);
        });
        return code;
    }
}
exports.default = MasterNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFzdGVyTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9wYW5lbC9vcGVyYXRpb24vbm9kZXMvbWFzdGVyL01hc3Rlck5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQ0FBbUU7QUFDbkUsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixvRUFBNEM7QUFDNUMscUNBQTZFO0FBQzdFLHVDQUFpRDtBQUVqRCxTQUFTLGdCQUFnQixDQUFFLElBQWdCLEVBQUUsS0FBbUI7SUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO1FBQUUsT0FBTztJQUU5QixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUN4QyxJQUFJLFdBQVcsRUFBRTtRQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDM0I7YUFDSTtZQUNELE9BQU87U0FDVjtRQUVELFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xDLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQTtLQUNMO0FBQ0wsQ0FBQztBQUVELE1BQXFCLFVBQVcsU0FBUSxpQkFBVTtJQUFsRDs7UUFFSSxrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUM3QixrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUU3QixpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUVsQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQiwwQkFBcUIsR0FBRyw0QkFBcUIsQ0FBQyxLQUFLLENBQUM7UUFFcEQsZUFBVSxHQUFvQixFQUFFLENBQUM7SUFtUnJDLENBQUM7SUFqUkcsZUFBZSxDQUFFLFdBQXFCO1FBQ2xDLElBQUksVUFBVSxHQUFpQixF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QUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBN1JELDZCQTZSQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYWRlck5vZGUsIFNoYWRlclNsb3QsIFNoYWRlclByb3BlcnkgfSBmcm9tIFwiLi4vLi4vYmFzZVwiO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IFNoYWRlckdyYXBoIGZyb20gXCIuLi8uLi9zaGFkZXJncmFwaFwiO1xyXG5pbXBvcnQgeyBDb25jcmV0ZVByZWNpc2lvblR5cGUsIFRleHR1cmVDb25jcmV0ZVByZWNpc2lvbiB9IGZyb20gXCIuLi8uLi90eXBlXCI7XHJcbmltcG9ydCB7IHNoYWRlclRlbXBsYXRlc0RpciB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xyXG5cclxuZnVuY3Rpb24gZmluZENvbm5lY3ROb2RlcyAoc2xvdDogU2hhZGVyU2xvdCwgbm9kZXM6IFNoYWRlck5vZGVbXSkge1xyXG4gICAgaWYgKCFzbG90LmNvbm5lY3RTbG90KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGNvbm5lY3ROb2RlID0gc2xvdC5jb25uZWN0U2xvdC5ub2RlO1xyXG4gICAgaWYgKGNvbm5lY3ROb2RlKSB7XHJcbiAgICAgICAgaWYgKCFub2Rlcy5pbmNsdWRlcyhjb25uZWN0Tm9kZSkpIHtcclxuICAgICAgICAgICAgbm9kZXMucHVzaChjb25uZWN0Tm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25uZWN0Tm9kZS5pbnB1dFNsb3RzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIGZpbmRDb25uZWN0Tm9kZXMoc2xvdCwgbm9kZXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hc3Rlck5vZGUgZXh0ZW5kcyBTaGFkZXJOb2RlIHtcclxuXHJcbiAgICB2c1Nsb3RJbmRpY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgZnNTbG90SW5kaWNlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICB0ZW1wbGF0ZVBhdGggPSAnJztcclxuXHJcbiAgICBpc01hc3Rlck5vZGUgPSB0cnVlO1xyXG4gICAgY29uY3JldGVQcmVjaXNpb25UeXBlID0gQ29uY3JldGVQcmVjaXNpb25UeXBlLkZpeGVkO1xyXG5cclxuICAgIHByb3BlcnRpZXM6IFNoYWRlclByb3BlcnlbXSA9IFtdO1xyXG5cclxuICAgIGdldENvbm5lY3ROb2RlcyAoc2xvdEluZGljZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IGlucHV0U2xvdHM6IFNoYWRlclNsb3RbXSA9IFtdO1xyXG4gICAgICAgIHNsb3RJbmRpY2VzLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzbG90ID0gdGhpcy5nZXRTbG90V2l0aFNsb3ROYW1lKG5hbWUpXHJcbiAgICAgICAgICAgIGlmIChzbG90KSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dFNsb3RzLnB1c2goc2xvdClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgbm9kZXM6IFNoYWRlck5vZGVbXSA9IFtdO1xyXG4gICAgICAgIGlucHV0U2xvdHMuZm9yRWFjaChzbG90ID0+IHtcclxuICAgICAgICAgICAgZmluZENvbm5lY3ROb2RlcyhzbG90LCBub2Rlcyk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbm9kZXMuc29ydCgoYSwgYikgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHkpO1xyXG4gICAgICAgIHJldHVybiBub2RlcztcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVZzQ29kZSAoKSB7XHJcbiAgICAgICAgbGV0IGNvZGU6IHN0cmluZ1tdID0gWydcXG4nXTtcclxuXHJcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5nZXRDb25uZWN0Tm9kZXModGhpcy52c1Nsb3RJbmRpY2VzKTtcclxuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBub2RlLmdlbmVyYXRlQ29kZSgpLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29kZS5wdXNoKCcgICAgJyArIGMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvZGUuam9pbignXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVGc0NvZGUgKCkge1xyXG4gICAgICAgIGxldCBjb2RlOiBzdHJpbmdbXSA9IFsnXFxuJ107XHJcblxyXG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMuZ2V0Q29ubmVjdE5vZGVzKHRoaXMuZnNTbG90SW5kaWNlcyk7XHJcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgbm9kZS5nZW5lcmF0ZUNvZGUoKS5zcGxpdCgnXFxuJykuZm9yRWFjaChjID0+IHtcclxuICAgICAgICAgICAgICAgIGMgKz0gYCAvLyAke25vZGUuY29uc3RydWN0b3IubmFtZX1gXHJcbiAgICAgICAgICAgICAgICBjb2RlLnB1c2goJyAgICAnICsgYyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlLmpvaW4oJ1xcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlUHJvcGVydGllc0NvZGUgKCkge1xyXG4gICAgICAgIGxldCB1bmlmb3JtID0gJ1xcbic7XHJcbiAgICAgICAgbGV0IG10bCA9ICdcXG4nXHJcbiAgICAgICAgbGV0IHVuaWZvcm1TYW1wbGVyID0gJyc7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHByb3BlcnRpZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYi5jb25jcmV0ZVByZWNpc2lvbiAtIGEuY29uY3JldGVQcmVjaXNpb247XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IGJsb2NrVW5pZm9ybUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcHJlY2lzaW9uID0gJyc7XHJcbiAgICAgICAgICAgIGxldCBtdGxWYWx1ZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcC5kZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBpc0NvbG9yID0gdmFsdWUuciAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGlzQ29sb3IgPyB2YWx1ZS5yIDogdmFsdWUueDtcclxuICAgICAgICAgICAgbGV0IHkgPSBpc0NvbG9yID8gdmFsdWUuZyA6IHZhbHVlLnk7XHJcbiAgICAgICAgICAgIGxldCB6ID0gaXNDb2xvciA/IHZhbHVlLmIgOiB2YWx1ZS56O1xyXG4gICAgICAgICAgICBsZXQgdyA9IGlzQ29sb3IgPyB2YWx1ZS5hIDogdmFsdWUudztcclxuXHJcbiAgICAgICAgICAgIGxldCBjb25jcmV0ZVByZWNpc2lvbiA9IHAubm9kZT8ub3V0cHV0U2xvdHNbMF0uY29uY3JldGVQcmVjaXNpb247XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uY3JldGVQcmVjaXNpb24gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9ICdmbG9hdCc7XHJcbiAgICAgICAgICAgICAgICBtdGxWYWx1ZSA9IGAke3ZhbHVlfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb25jcmV0ZVByZWNpc2lvbiA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uID0gJ3ZlYzInO1xyXG4gICAgICAgICAgICAgICAgbXRsVmFsdWUgPSBgWyR7eH0sICR7eX1dYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmNyZXRlUHJlY2lzaW9uID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSAndmVjNCc7XHJcbiAgICAgICAgICAgICAgICBtdGxWYWx1ZSA9IGBbJHt4fSwgJHt5fSwgJHt6fSwgMF1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29uY3JldGVQcmVjaXNpb24gPT09IDQpIHtcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9ICd2ZWM0JztcclxuICAgICAgICAgICAgICAgIG10bFZhbHVlID0gYFske3h9LCAke3l9LCAke3p9LCAgJHt3fV1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29uY3JldGVQcmVjaXNpb24gPT09IFRleHR1cmVDb25jcmV0ZVByZWNpc2lvbi5UZXh0dXJlMkQpIHtcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9ICdzYW1wbGVyMkQnXHJcbiAgICAgICAgICAgICAgICBtdGxWYWx1ZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGVkaXRvclN0ciA9IGlzQ29sb3IgPyBgLCBlZGl0b3I6IHsgdHlwZTogY29sb3IgfWAgOiAnJ1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmNyZXRlUHJlY2lzaW9uIDwgVGV4dHVyZUNvbmNyZXRlUHJlY2lzaW9uLlRleHR1cmUyRCkge1xyXG4gICAgICAgICAgICAgICAgdW5pZm9ybSArPSBgICAgICR7cHJlY2lzaW9ufSAke3AubmFtZX07XFxuYDtcclxuICAgICAgICAgICAgICAgIGJsb2NrVW5pZm9ybUNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1bmlmb3JtU2FtcGxlciArPSBgICB1bmlmb3JtICR7cHJlY2lzaW9ufSAke3AubmFtZX07XFxuYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtdGwgKz0gYCAgICAgICAgJHtwLm5hbWV9OiB7IHZhbHVlOiAke210bFZhbHVlfSAke2VkaXRvclN0cn19XFxuYFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChibG9ja1VuaWZvcm1Db3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICB1bmlmb3JtICs9ICcgICAgdmVjNCBlbXB0eV92YWx1ZTtcXG4nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1bmlmb3JtLFxyXG4gICAgICAgICAgICB1bmlmb3JtU2FtcGxlcixcclxuICAgICAgICAgICAgbXRsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbGFjZUNodW5rcyAoY29kZSkge1xyXG4gICAgICAgIGxldCBkZXBDaHVua3M6IHN0cmluZ1tdID0gWydjb21tb24nXTtcclxuICAgICAgICBsZXQgYWxsTm9kZXMgPSBTaGFkZXJHcmFwaC5hbGxOb2RlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYWxsTm9kZXNbaV0ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gYWxsTm9kZXNbaV1bal07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG5vZGUuZGVwQ2h1bmtzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZXBDaHVua3MuaW5jbHVkZXMobm9kZS5kZXBDaHVua3Nba10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcENodW5rcy5wdXNoKG5vZGUuZGVwQ2h1bmtzW2tdKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNodW5rSW5jbHVkZXMgPSAnXFxuJztcclxuICAgICAgICBsZXQgY2h1bmtzID0gJ1xcbic7XHJcbiAgICAgICAgZGVwQ2h1bmtzLmZvckVhY2goY2h1bmtOYW1lID0+IHtcclxuICAgICAgICAgICAgbGV0IGNodW5rUGF0aCA9IHBhdGguam9pbihzaGFkZXJUZW1wbGF0ZXNEaXIsIGBjaHVua3MvJHtjaHVua05hbWV9LmNodW5rYCk7XHJcbiAgICAgICAgICAgIGxldCBjaHVuayA9IGZzLnJlYWRGaWxlU3luYyhjaHVua1BhdGgsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBpZiAoIWNodW5rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBDYW4gbm90IGZpbmQgY2h1bmsgd2l0aCBwYXRoIFske2NodW5rUGF0aH1dYClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjaHVua3MgKz0gY2h1bmsgKyAnXFxuJztcclxuICAgICAgICAgICAgY2h1bmtJbmNsdWRlcyArPSBgICAjaW5jbHVkZSA8c2hhZGVyX2dyYXBoXyR7Y2h1bmtOYW1lfT5cXG5gO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7Y2h1bmtzfX0nLCBjaHVua3MpO1xyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7dnNfY2h1bmtzfX0nLCBjaHVua0luY2x1ZGVzKTtcclxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKCd7e2ZzX2NodW5rc319JywgY2h1bmtJbmNsdWRlcyk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlVmFyaW5ncyAoY29kZSkge1xyXG4gICAgICAgIGxldCBkZXBWYXJpbmdzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICAgICAgbGV0IGFsbE5vZGVzID0gU2hhZGVyR3JhcGguYWxsTm9kZXM7XHJcbiAgICAgICAgYWxsTm9kZXMuZm9yRWFjaChub2RlcyA9PiB7XHJcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmRlcFZhcmluZ3MuZm9yRWFjaCh2YXJpbmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVwVmFyaW5ncy5pbmNsdWRlcyh2YXJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcFZhcmluZ3MucHVzaCh2YXJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHZzX3ZhcmluZ19kZWZpbmUgPSAnJ1xyXG4gICAgICAgIGxldCB2c192YXJpbmcgPSAnJ1xyXG4gICAgICAgIGxldCBmc192YXJpbmdfZGVmaW5lID0gJydcclxuICAgICAgICBsZXQgZnNfdmFyaW5nID0gJydcclxuICAgICAgICBkZXBWYXJpbmdzLmZvckVhY2godmFyaW5nID0+IHtcclxuICAgICAgICAgICAgaWYgKHZhcmluZyA9PT0gJ1Bvc2l0aW9uU3BhY2UuT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgdnNfdmFyaW5nX2RlZmluZSArPSAnb3V0IHZlYzMgdl9wb3M7XFxuJ1xyXG4gICAgICAgICAgICAgICAgdnNfdmFyaW5nICs9ICd2X3BvcyA9IHBvc2l0aW9uLnh5ejtcXG4nO1xyXG4gICAgICAgICAgICAgICAgZnNfdmFyaW5nX2RlZmluZSArPSAnaW4gdmVjMyB2X3BvcztcXG4nO1xyXG4gICAgICAgICAgICAgICAgZnNfdmFyaW5nICs9ICd2ZWM0IHBvc2l0aW9uID0gdmVjNCh2X3BvcywgMS4pOyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaW5nID09PSAnUG9zaXRpb25TcGFjZS5WaWV3Jykge1xyXG4gICAgICAgICAgICAgICAgdnNfdmFyaW5nX2RlZmluZSArPSAnb3V0IHZlYzMgdl92aWV3UG9zO1xcbidcclxuICAgICAgICAgICAgICAgIHZzX3ZhcmluZyArPSAndl92aWV3UG9zID0gdmlld1Bvc2l0aW9uLnh5ejtcXG4nO1xyXG4gICAgICAgICAgICAgICAgZnNfdmFyaW5nX2RlZmluZSArPSAnaW4gdmVjMyB2X3ZpZXdQb3M7XFxuJztcclxuICAgICAgICAgICAgICAgIGZzX3ZhcmluZyArPSAndmVjNCB2aWV3UG9zaXRpb24gPSB2ZWM0KHZfdmlld1BvcywgMS4pOyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaW5nID09PSAnUG9zaXRpb25TcGFjZS5Xb3JsZCcgfHwgdmFyaW5nID09PSAnUG9zaXRpb25TcGFjZS5BYnNvbHV0ZVdvcmxkJykge1xyXG4gICAgICAgICAgICAgICAgdnNfdmFyaW5nX2RlZmluZSArPSAnb3V0IHZlYzMgdl93b3JsZFBvcztcXG4nXHJcbiAgICAgICAgICAgICAgICB2c192YXJpbmcgKz0gJ3Zfd29ybGRQb3MgPSB3b3JsZFBvc2l0aW9uLnh5ejtcXG4nO1xyXG4gICAgICAgICAgICAgICAgZnNfdmFyaW5nX2RlZmluZSArPSAnaW4gdmVjMyB2X3dvcmxkUG9zO1xcbic7XHJcbiAgICAgICAgICAgICAgICBmc192YXJpbmcgKz0gJ3ZlYzQgd29ybGRQb3NpdGlvbiA9IHZlYzQodl93b3JsZFBvcywgMS4pOyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaW5nID09PSAndGFuZ2VudCBwb3NpdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZhcmluZyA9PT0gJ29iamVjdCBub3JtYWwnKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh2YXJpbmcgPT09ICd2aWV3IG5vcm1hbCcpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaW5nID09PSAnd29ybGQgbm9ybWFsJykge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaW5nID09PSAndGFuZ2VudCBub3JtYWwnKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7dnNfdmFyaW5nX2RlZmluZX19JywgdnNfdmFyaW5nX2RlZmluZSlcclxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKCd7e3ZzX3ZhcmluZ319JywgdnNfdmFyaW5nKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7ZnNfdmFyaW5nX2RlZmluZX19JywgZnNfdmFyaW5nX2RlZmluZSlcclxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKCd7e2ZzX3ZhcmluZ319JywgZnNfdmFyaW5nKVxyXG5cclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZUNvZGUgKCkge1xyXG4gICAgICAgIGxldCBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHRoaXMudGVtcGxhdGVQYXRoLCAndXRmLTgnKTtcclxuXHJcbiAgICAgICAgY29kZSA9IHRoaXMuZ2VuZXJhdGVWYXJpbmdzKGNvZGUpO1xyXG5cclxuICAgICAgICBjb25zdCB2c0NvZGUgPSB0aGlzLmdlbmVyYXRlVnNDb2RlKCk7XHJcbiAgICAgICAgY29uc3QgZnNDb2RlID0gdGhpcy5nZW5lcmF0ZUZzQ29kZSgpO1xyXG5cclxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKCd7e3ZzfX0nLCB2c0NvZGUpO1xyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7ZnN9fScsIGZzQ29kZSk7XHJcblxyXG4gICAgICAgIGNvZGUgPSB0aGlzLnJlcGxhY2VDaHVua3MoY29kZSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5wcm9wZXJ0aWVzIHx8IHRoaXMucHJvcGVydGllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvcHJvcGVydGllczogJnByb3BzL2csICcnKTtcclxuICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvcHJvcGVydGllczogXFwqcHJvcHMvZywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5nZW5lcmF0ZVByb3BlcnRpZXNDb2RlKCk7XHJcbiAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgne3twcm9wZXJ0aWVzfX0nLCBwcm9wcy51bmlmb3JtKTtcclxuICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKCd7e3Byb3BlcnRpZXNfc2FtcGxlcn19JywgcHJvcHMudW5pZm9ybVNhbXBsZXIpO1xyXG4gICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoJ3t7cHJvcGVydGllc19tdGx9fScsIHByb3BzLm10bCk7IFxyXG5cclxuICAgICAgICBcclxuICAgICAgICAvLyBvbGQgc2hhZGVyIGdyYXBoIHZlcnNpb24gZG8gbm90IGhhdmUgdmVydGV4IHNsb3RzXHJcbiAgICAgICAgbGV0IHZlcnRleFNsb3ROYW1lcyA9IFsnVmVydGV4IFBvc2l0aW9uJywgJ1ZlcnRleCBOb3JtYWwnLCAnVmVydGV4IFRhbmdlbnQnLCAnUG9zaXRpb24nXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dFNsb3RzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9IGBzbG90XyR7c2xvdC5kaXNwbGF5TmFtZS5yZXBsYWNlKC8gL2csICdfJyl9YDtcclxuICAgICAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodmVydGV4U2xvdE5hbWVzLmluY2x1ZGVzKHNsb3QuZGlzcGxheU5hbWUpIHx8IHNsb3QuZGlzcGxheU5hbWUgPT09ICdOb3JtYWwnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2xvdC5jb25uZWN0U2xvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2xvdC5zbG90VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNsb3Quc2xvdFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cChge3ske3RlbXBOYW1lfSAqPSogKiguKil9fWApO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IHJlZy5leGVjKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVzWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UocmVnLCB2YWx1ZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBcclxuICAgICAgICB2ZXJ0ZXhTbG90TmFtZXMuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgdmFyIHRlbXBOYW1lID0gYHNsb3RfJHtuYW1lLnJlcGxhY2UoLyAvZywgJ18nKX1gO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYHt7JHt0ZW1wTmFtZX0gKj0qICooLiopfX1gKTtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHJlZy5leGVjKGNvZGUpO1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlc1sxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKHJlZywgdmFsdWUpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==