import { ScheduleMemoryParams } from "@/lib/fsrsWrapper";

let memory = ScheduleMemoryParams(null, "Good");
console.log(JSON.stringify(memory, null, 2));

memory = ScheduleMemoryParams(memory, "Fail");
console.log(JSON.stringify(memory, null, 2));

memory = ScheduleMemoryParams(memory, "Good");
console.log(JSON.stringify(memory, null, 2));

memory = ScheduleMemoryParams(memory, "Good");
console.log(JSON.stringify(memory, null, 2));

memory = ScheduleMemoryParams(memory, "Fail");
console.log(JSON.stringify(memory, null, 2));
