"use strict";
//User data stores the user's schedule, e.g. upcoming tasks
//However a task doesn't have a specific date attached to it, but rather a pattern
//It is the job of the scheduler to schedule the tasks that need to be completed on a day
const DEFAULTS = {};
DEFAULTS[SETUP_KEY] = { tasks: [], rewards: [] };
DEFAULTS[USER_DATA_KEY] = { balance: 0, tasks: [], rewards: [], lastScheduleUpdate: FormatDate(new Date()) };
