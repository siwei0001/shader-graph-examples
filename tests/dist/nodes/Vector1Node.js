"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector1Node = void 0;
const base_1 = require("../base");
class Vector1Node extends base_1.ShaderNode {
    constructor(data) {
        super(data);
    }
    generateCode() {
        let inputSlots = this.slots.filter(s => s.type === base_1.ShaderSlotType.Input);
        let outputSlots = this.slots.filter(s => s.type === base_1.ShaderSlotType.Output);
        return `float ${outputSlots[0].varName} = ${inputSlots[0].slotValue};`;
    }
}
exports.Vector1Node = Vector1Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yMU5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZXMvVmVjdG9yMU5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0NBQWlFO0FBRWpFLE1BQWEsV0FBWSxTQUFRLGlCQUFVO0lBQ3ZDLFlBQVksSUFBUztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUsscUJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUsscUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRSxPQUFPLFNBQVUsV0FBWSxDQUFDLENBQUMsQ0FBZ0IsQ0FBQyxPQUFPLE1BQU8sVUFBVyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQztJQUM3RyxDQUFDO0NBQ0o7QUFWRCxrQ0FVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYWRlck5vZGUsIFNoYWRlclNsb3RUeXBlLCBTaGFkZXJTbG90IH0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IxTm9kZSBleHRlbmRzIFNoYWRlck5vZGUge1xyXG4gICAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVDb2RlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXRTbG90cyA9IHRoaXMuc2xvdHMuZmlsdGVyKHMgPT4gcy50eXBlID09PSBTaGFkZXJTbG90VHlwZS5JbnB1dCk7XHJcbiAgICAgICAgbGV0IG91dHB1dFNsb3RzID0gdGhpcy5zbG90cy5maWx0ZXIocyA9PiBzLnR5cGUgPT09IFNoYWRlclNsb3RUeXBlLk91dHB1dCk7XHJcbiAgICAgICAgcmV0dXJuIGBmbG9hdCAkeyhvdXRwdXRTbG90cyFbMF0gYXMgU2hhZGVyU2xvdCkudmFyTmFtZX0gPSAkeyhpbnB1dFNsb3RzIVswXSBhcyBTaGFkZXJTbG90KS5zbG90VmFsdWV9O2A7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==