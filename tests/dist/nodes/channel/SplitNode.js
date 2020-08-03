"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
class SplitNode extends base_1.ShaderNode {
    constructor(data) {
        super(data);
        this.concretePrecisionType = base_1.ConcretePrecisionType.Fixed;
    }
    calcConcretePrecision() {
        super.calcConcretePrecision();
    }
    generateCode() {
        let Value = this.getInputValue(0);
        let code = '';
        let slotR = this.getOutputSlotWithSlotName('R');
        let slotG = this.getOutputSlotWithSlotName('G');
        let slotB = this.getOutputSlotWithSlotName('B');
        let slotA = this.getOutputSlotWithSlotName('A');
        if (slotR && slotR.connectSlot) {
            code += `float ${slotR === null || slotR === void 0 ? void 0 : slotR.varName} = ${Value}.r;\n`;
        }
        if (slotG && slotG.connectSlot) {
            code += `float ${slotG === null || slotG === void 0 ? void 0 : slotG.varName} = ${Value}.g;\n`;
        }
        if (slotB && slotB.connectSlot) {
            code += `float ${slotB === null || slotB === void 0 ? void 0 : slotB.varName} = ${Value}.b;\n`;
        }
        if (slotA && slotA.connectSlot) {
            code += `float ${slotA === null || slotA === void 0 ? void 0 : slotA.varName} = ${Value}.a;\n`;
        }
        return code;
    }
}
exports.default = SplitNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BsaXROb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25vZGVzL2NoYW5uZWwvU3BsaXROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQStEO0FBRS9ELE1BQXFCLFNBQVUsU0FBUSxpQkFBVTtJQUc3QyxZQUFhLElBQUk7UUFDYixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFIaEIsMEJBQXFCLEdBQUcsNEJBQXFCLENBQUMsS0FBSyxDQUFDO0lBSXBELENBQUM7SUFFRCxxQkFBcUI7UUFDakIsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUE7SUFDakMsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksSUFBSSxTQUFTLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUM7U0FDckQ7UUFDRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksSUFBSSxTQUFTLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUM7U0FDckQ7UUFDRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksSUFBSSxTQUFTLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUM7U0FDckQ7UUFDRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksSUFBSSxTQUFTLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFoQ0QsNEJBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2hhZGVyTm9kZSwgQ29uY3JldGVQcmVjaXNpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwbGl0Tm9kZSBleHRlbmRzIFNoYWRlck5vZGUge1xyXG4gICAgY29uY3JldGVQcmVjaXNpb25UeXBlID0gQ29uY3JldGVQcmVjaXNpb25UeXBlLkZpeGVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkYXRhKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsY0NvbmNyZXRlUHJlY2lzaW9uICgpIHtcclxuICAgICAgICBzdXBlci5jYWxjQ29uY3JldGVQcmVjaXNpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlQ29kZSAoKSB7XHJcbiAgICAgICAgbGV0IFZhbHVlID0gdGhpcy5nZXRJbnB1dFZhbHVlKDApO1xyXG4gICAgICAgIGxldCBjb2RlID0gJyc7XHJcbiAgICAgICAgbGV0IHNsb3RSID0gdGhpcy5nZXRPdXRwdXRTbG90V2l0aFNsb3ROYW1lKCdSJyk7XHJcbiAgICAgICAgbGV0IHNsb3RHID0gdGhpcy5nZXRPdXRwdXRTbG90V2l0aFNsb3ROYW1lKCdHJyk7XHJcbiAgICAgICAgbGV0IHNsb3RCID0gdGhpcy5nZXRPdXRwdXRTbG90V2l0aFNsb3ROYW1lKCdCJyk7XHJcbiAgICAgICAgbGV0IHNsb3RBID0gdGhpcy5nZXRPdXRwdXRTbG90V2l0aFNsb3ROYW1lKCdBJyk7XHJcbiAgICAgICAgaWYgKHNsb3RSICYmIHNsb3RSLmNvbm5lY3RTbG90KSB7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gYGZsb2F0ICR7c2xvdFI/LnZhck5hbWV9ID0gJHtWYWx1ZX0ucjtcXG5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2xvdEcgJiYgc2xvdEcuY29ubmVjdFNsb3QpIHtcclxuICAgICAgICAgICAgY29kZSArPSBgZmxvYXQgJHtzbG90Rz8udmFyTmFtZX0gPSAke1ZhbHVlfS5nO1xcbmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzbG90QiAmJiBzbG90Qi5jb25uZWN0U2xvdCkge1xyXG4gICAgICAgICAgICBjb2RlICs9IGBmbG9hdCAke3Nsb3RCPy52YXJOYW1lfSA9ICR7VmFsdWV9LmI7XFxuYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNsb3RBICYmIHNsb3RBLmNvbm5lY3RTbG90KSB7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gYGZsb2F0ICR7c2xvdEE/LnZhck5hbWV9ID0gJHtWYWx1ZX0uYTtcXG5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxufVxyXG4iXX0=