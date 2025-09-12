import schedulesData from "@/services/mockData/schedules.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ScheduleService {
  constructor() {
    this.schedules = [...schedulesData];
  }

  async getAll() {
    await delay(300);
    return [...this.schedules];
  }

  async getById(id) {
    await delay(200);
    const schedule = this.schedules.find(sched => sched.Id === parseInt(id));
    if (!schedule) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    return { ...schedule };
  }

  async getByEmployeeId(employeeId) {
    await delay(300);
    return this.schedules
      .filter(sched => sched.employeeId === employeeId.toString())
      .map(sched => ({ ...sched }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getTodaySchedule(employeeId) {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const schedule = this.schedules.find(sched => 
      sched.employeeId === employeeId.toString() && 
      sched.date === today
    );
    return schedule ? { ...schedule } : null;
  }

  async getUpcomingSchedules(employeeId, days = 7) {
    await delay(300);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.schedules
      .filter(sched => {
        const schedDate = new Date(sched.date);
        return sched.employeeId === employeeId.toString() &&
          schedDate >= today && schedDate <= futureDate;
      })
      .map(sched => ({ ...sched }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async create(scheduleData) {
    await delay(400);
    const maxId = Math.max(...this.schedules.map(sched => sched.Id), 0);
    const newSchedule = {
      Id: maxId + 1,
      ...scheduleData
    };
    this.schedules.push(newSchedule);
    return { ...newSchedule };
  }

  async update(id, updateData) {
    await delay(400);
    const index = this.schedules.findIndex(sched => sched.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    this.schedules[index] = { ...this.schedules[index], ...updateData };
    return { ...this.schedules[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.schedules.findIndex(sched => sched.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    this.schedules.splice(index, 1);
    return true;
  }
}

export default new ScheduleService();