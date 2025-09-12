import timeEntriesData from "@/services/mockData/timeEntries.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeEntryService {
  constructor() {
    this.timeEntries = [...timeEntriesData];
  }

  async getAll() {
    await delay(300);
    return [...this.timeEntries];
  }

  async getById(id) {
    await delay(200);
    const entry = this.timeEntries.find(entry => entry.Id === parseInt(id));
    if (!entry) {
      throw new Error(`Time entry with Id ${id} not found`);
    }
    return { ...entry };
  }

  async getByEmployeeId(employeeId) {
    await delay(300);
    return this.timeEntries
      .filter(entry => entry.employeeId === employeeId.toString())
      .map(entry => ({ ...entry }));
  }

  async getCurrentTimeEntry(employeeId) {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const entry = this.timeEntries.find(entry => 
      entry.employeeId === employeeId.toString() && 
      entry.date === today
    );
    return entry ? { ...entry } : null;
  }

  async clockIn(employeeId) {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Check if already clocked in today
    const existingEntry = this.timeEntries.find(entry => 
      entry.employeeId === employeeId.toString() && 
      entry.date === today
    );

    if (existingEntry && !existingEntry.clockOut) {
      throw new Error("Already clocked in for today");
    }

    const maxId = Math.max(...this.timeEntries.map(entry => entry.Id), 0);
    const newEntry = {
      Id: maxId + 1,
      employeeId: employeeId.toString(),
      clockIn: now,
      clockOut: null,
      hoursWorked: 0,
      date: today
    };

    this.timeEntries.push(newEntry);
    return { ...newEntry };
  }

  async clockOut(employeeId) {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    const entryIndex = this.timeEntries.findIndex(entry => 
      entry.employeeId === employeeId.toString() && 
      entry.date === today &&
      !entry.clockOut
    );

    if (entryIndex === -1) {
      throw new Error("No active clock-in found for today");
    }

    const entry = this.timeEntries[entryIndex];
    const clockInTime = new Date(entry.clockIn);
    const clockOutTime = new Date(now);
    const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60);

    this.timeEntries[entryIndex] = {
      ...entry,
      clockOut: now,
      hoursWorked: Math.round(hoursWorked * 100) / 100
    };

    return { ...this.timeEntries[entryIndex] };
  }

  async create(entryData) {
    await delay(400);
    const maxId = Math.max(...this.timeEntries.map(entry => entry.Id), 0);
    const newEntry = {
      Id: maxId + 1,
      ...entryData,
      date: entryData.date || new Date().toISOString().split('T')[0]
    };
    this.timeEntries.push(newEntry);
    return { ...newEntry };
  }

  async update(id, updateData) {
    await delay(400);
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time entry with Id ${id} not found`);
    }
    this.timeEntries[index] = { ...this.timeEntries[index], ...updateData };
    return { ...this.timeEntries[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time entry with Id ${id} not found`);
    }
    this.timeEntries.splice(index, 1);
    return true;
  }

  async getWeeklyHours(employeeId) {
    await delay(300);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyEntries = this.timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.employeeId === employeeId.toString() &&
        entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    return weeklyEntries.reduce((total, entry) => total + entry.hoursWorked, 0);
  }
}

export default new TimeEntryService();