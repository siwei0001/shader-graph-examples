"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../../base");
const type_1 = require("../../../type");
class NormalVectorNode extends base_1.ShaderNode {
    constructor(data) {
        super(data);
        this.concretePrecisionType = type_1.ConcretePrecisionType.Fixed;
        let varing = 'NormalSpace.Object';
        if (this.data.m_Space === type_1.NormalSpace.Object) {
            varing = 'NormalSpace.Object';
        }
        else if (this.data.m_Space === type_1.NormalSpace.View) {
            varing = 'NormalSpace.View';
        }
        else if (this.data.m_Space === type_1.NormalSpace.Tangent) {
            varing = 'NormalSpace.Tangent';
            console.error('Not support Tangent Normal');
        }
        else if (this.data.m_Space === type_1.NormalSpace.World) {
            varing = 'NormalSpace.World';
        }
        this.depVarings.push(varing);
    }
    calcConcretePrecision() {
        this.slots.forEach(slot => {
            slot._concretePrecision = 3;
        });
    }
    generateCode() {
        let name = 'v_normal';
        if (this.data.m_Space === type_1.NormalSpace.Object) {
            name = 'v_normal';
        }
        else if (this.data.m_Space === type_1.NormalSpace.View) {
            name = 'v_viewNormal';
        }
        else if (this.data.m_Space === type_1.NormalSpace.Tangent) {
            // name = 'v_tangentNormal';
            name = 'v_worldNormal';
        }
        else if (this.data.m_Space === type_1.NormalSpace.World) {
            name = 'v_worldNormal';
        }
        return `${this.getOutputVarDefine(0)} = ${name};`;
    }
}
exports.default = NormalVectorNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9ybWFsVmVjdG9yTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NvdXJjZS9wYW5lbC9vcGVyYXRpb24vbm9kZXMvaW5wdXQvZ2VvbWV0cnkvTm9ybWFsVmVjdG9yTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUEyQztBQUMzQyx3Q0FBbUU7QUFHbkUsTUFBcUIsZ0JBQWlCLFNBQVEsaUJBQVU7SUFHcEQsWUFBYSxJQUFJO1FBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBSGYsMEJBQXFCLEdBQUcsNEJBQXFCLENBQUMsS0FBSyxDQUFDO1FBS2hELElBQUksTUFBTSxHQUFHLG9CQUFvQixDQUFBO1FBQ2pDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssa0JBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDMUMsTUFBTSxHQUFHLG9CQUFvQixDQUFDO1NBQ2pDO2FBQ0ksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxrQkFBVyxDQUFDLElBQUksRUFBRTtZQUM3QyxNQUFNLEdBQUcsa0JBQWtCLENBQUM7U0FDL0I7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLGtCQUFXLENBQUMsT0FBTyxFQUFFO1lBQ2hELE1BQU0sR0FBRyxxQkFBcUIsQ0FBQztZQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDL0M7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLGtCQUFXLENBQUMsS0FBSyxFQUFFO1lBQzlDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztTQUNoQztRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxxQkFBcUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxZQUFZO1FBQ1IsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssa0JBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDMUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUNyQjthQUNJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssa0JBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDN0MsSUFBSSxHQUFHLGNBQWMsQ0FBQztTQUN6QjthQUNJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssa0JBQVcsQ0FBQyxPQUFPLEVBQUU7WUFDaEQsNEJBQTRCO1lBQzVCLElBQUksR0FBRyxlQUFlLENBQUM7U0FDMUI7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLGtCQUFXLENBQUMsS0FBSyxFQUFFO1lBQzlDLElBQUksR0FBRyxlQUFlLENBQUM7U0FDMUI7UUFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO0lBQ3RELENBQUM7Q0FDSjtBQS9DRCxtQ0ErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFkZXJOb2RlIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2VcIjtcclxuaW1wb3J0IHsgQ29uY3JldGVQcmVjaXNpb25UeXBlLCBOb3JtYWxTcGFjZSB9IGZyb20gXCIuLi8uLi8uLi90eXBlXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9ybWFsVmVjdG9yTm9kZSBleHRlbmRzIFNoYWRlck5vZGUge1xyXG4gICAgY29uY3JldGVQcmVjaXNpb25UeXBlID0gQ29uY3JldGVQcmVjaXNpb25UeXBlLkZpeGVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkYXRhKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSlcclxuXHJcbiAgICAgICAgbGV0IHZhcmluZyA9ICdOb3JtYWxTcGFjZS5PYmplY3QnXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5tX1NwYWNlID09PSBOb3JtYWxTcGFjZS5PYmplY3QpIHtcclxuICAgICAgICAgICAgdmFyaW5nID0gJ05vcm1hbFNwYWNlLk9iamVjdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZGF0YS5tX1NwYWNlID09PSBOb3JtYWxTcGFjZS5WaWV3KSB7XHJcbiAgICAgICAgICAgIHZhcmluZyA9ICdOb3JtYWxTcGFjZS5WaWV3JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5kYXRhLm1fU3BhY2UgPT09IE5vcm1hbFNwYWNlLlRhbmdlbnQpIHtcclxuICAgICAgICAgICAgdmFyaW5nID0gJ05vcm1hbFNwYWNlLlRhbmdlbnQnO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdOb3Qgc3VwcG9ydCBUYW5nZW50IE5vcm1hbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmRhdGEubV9TcGFjZSA9PT0gTm9ybWFsU3BhY2UuV29ybGQpIHtcclxuICAgICAgICAgICAgdmFyaW5nID0gJ05vcm1hbFNwYWNlLldvcmxkJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVwVmFyaW5ncy5wdXNoKHZhcmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsY0NvbmNyZXRlUHJlY2lzaW9uICgpIHtcclxuICAgICAgICB0aGlzLnNsb3RzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIHNsb3QuX2NvbmNyZXRlUHJlY2lzaW9uID0gMztcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlQ29kZSAoKSB7XHJcbiAgICAgICAgbGV0IG5hbWUgPSAndl9ub3JtYWwnO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEubV9TcGFjZSA9PT0gTm9ybWFsU3BhY2UuT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSAndl9ub3JtYWwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmRhdGEubV9TcGFjZSA9PT0gTm9ybWFsU3BhY2UuVmlldykge1xyXG4gICAgICAgICAgICBuYW1lID0gJ3Zfdmlld05vcm1hbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZGF0YS5tX1NwYWNlID09PSBOb3JtYWxTcGFjZS5UYW5nZW50KSB7XHJcbiAgICAgICAgICAgIC8vIG5hbWUgPSAndl90YW5nZW50Tm9ybWFsJztcclxuICAgICAgICAgICAgbmFtZSA9ICd2X3dvcmxkTm9ybWFsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5kYXRhLm1fU3BhY2UgPT09IE5vcm1hbFNwYWNlLldvcmxkKSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSAndl93b3JsZE5vcm1hbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmdldE91dHB1dFZhckRlZmluZSgwKX0gPSAke25hbWV9O2A7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==