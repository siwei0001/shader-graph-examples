"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
class PolarCoordinatesNode extends base_1.ShaderNode {
    constructor() {
        super(...arguments);
        this.concretePrecisionType = base_1.ConcretePrecisionType.Fixed;
        this.depChunks = ['uv'];
    }
    generateCode() {
        let UV;
        if (!this.inputSlots[0].connectSlot) {
            UV = 'v_uv';
        }
        else {
            UV = this.getInputValue(0);
        }
        let Center = this.getInputValue(1);
        let RadialScale = this.getInputValue(2);
        let LengthScale = this.getInputValue(2);
        return `vec2 ${this.getOutputVarName(0)} = polarCoordinates(${UV}, ${Center}, ${RadialScale}, ${LengthScale});`;
    }
}
exports.default = PolarCoordinatesNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9sYXJDb29yZGluYXRlc05vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbm9kZXMvdXYvUG9sYXJDb29yZGluYXRlc05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBK0Q7QUFFL0QsTUFBcUIsb0JBQXFCLFNBQVEsaUJBQVU7SUFBNUQ7O1FBQ0ksMEJBQXFCLEdBQUcsNEJBQXFCLENBQUMsS0FBSyxDQUFDO1FBQ3BELGNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBZXRCLENBQUM7SUFiRyxZQUFZO1FBQ1IsSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDakMsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNmO2FBQ0k7WUFDRCxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUNELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sUUFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEtBQUssTUFBTSxLQUFLLFdBQVcsS0FBSyxXQUFXLElBQUksQ0FBQztJQUNwSCxDQUFDO0NBQ0o7QUFqQkQsdUNBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2hhZGVyTm9kZSwgQ29uY3JldGVQcmVjaXNpb25UeXBlIH0gZnJvbSBcIi4uLy4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvbGFyQ29vcmRpbmF0ZXNOb2RlIGV4dGVuZHMgU2hhZGVyTm9kZSB7XHJcbiAgICBjb25jcmV0ZVByZWNpc2lvblR5cGUgPSBDb25jcmV0ZVByZWNpc2lvblR5cGUuRml4ZWQ7XHJcbiAgICBkZXBDaHVua3MgPSBbJ3V2J11cclxuXHJcbiAgICBnZW5lcmF0ZUNvZGUgKCkge1xyXG4gICAgICAgIGxldCBVVjtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXRTbG90c1swXS5jb25uZWN0U2xvdCkge1xyXG4gICAgICAgICAgICBVViA9ICd2X3V2JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFVWID0gdGhpcy5nZXRJbnB1dFZhbHVlKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgQ2VudGVyID0gdGhpcy5nZXRJbnB1dFZhbHVlKDEpO1xyXG4gICAgICAgIGxldCBSYWRpYWxTY2FsZSA9IHRoaXMuZ2V0SW5wdXRWYWx1ZSgyKTtcclxuICAgICAgICBsZXQgTGVuZ3RoU2NhbGUgPSB0aGlzLmdldElucHV0VmFsdWUoMik7XHJcbiAgICAgICAgcmV0dXJuIGB2ZWMyICR7dGhpcy5nZXRPdXRwdXRWYXJOYW1lKDApfSA9IHBvbGFyQ29vcmRpbmF0ZXMoJHtVVn0sICR7Q2VudGVyfSwgJHtSYWRpYWxTY2FsZX0sICR7TGVuZ3RoU2NhbGV9KTtgO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==