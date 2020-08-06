"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../../base");
class RadiansToDegreesNode extends base_1.ShaderNode {
    generateCode() {
        let In = this.getInputValue(0);
        return `${this.getOutputVarDefine(0)} = degrees(${In});`;
    }
}
exports.default = RadiansToDegreesNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFkaWFuc1RvRGVncmVlc05vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zb3VyY2UvcGFuZWwvb3BlcmF0aW9uL25vZGVzL21hdGgvdHJpZ29ub21ldHJ5L1JhZGlhbnNUb0RlZ3JlZXNOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQTJDO0FBRTNDLE1BQXFCLG9CQUFxQixTQUFRLGlCQUFVO0lBQ3hELFlBQVk7UUFDUixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBTEQsdUNBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFkZXJOb2RlIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhZGlhbnNUb0RlZ3JlZXNOb2RlIGV4dGVuZHMgU2hhZGVyTm9kZSB7XHJcbiAgICBnZW5lcmF0ZUNvZGUgKCkge1xyXG4gICAgICAgIGxldCBJbiA9IHRoaXMuZ2V0SW5wdXRWYWx1ZSgwKTtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRPdXRwdXRWYXJEZWZpbmUoMCl9ID0gZGVncmVlcygke0lufSk7YDtcclxuICAgIH1cclxufVxyXG4iXX0=