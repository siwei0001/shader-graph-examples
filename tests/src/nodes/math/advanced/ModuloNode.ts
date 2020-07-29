import { ShaderNode, ShaderSlotType, ShaderSlot } from "../../../base";

export default class ExponentialNode extends ShaderNode {
    generateCode () {
        let A = this.getInputValue(0);
        let B = this.getInputValue(1);
        return `${this.getOutputVarDefine(0)} = mod(${A}, ${B});`;
    }
}