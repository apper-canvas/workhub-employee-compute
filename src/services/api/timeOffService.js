import timeOffRequestsData from "@/services/mockData/timeOffRequests.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeOffService {
  constructor() {
    this.timeOffRequests = [...timeOffRequestsData];
  }

  async getAll() {
    await delay(300);
    return [...this.timeOffRequests];
  }

  async getById(id) {
    await delay(200);
    const request = this.timeOffRequests.find(req => req.Id === parseInt(id));
    if (!request) {
      throw new Error(`Time off request with Id ${id} not found`);
    }
    return { ...request };
  }

  async getByEmployeeId(employeeId) {
    await delay(300);
    return this.timeOffRequests
      .filter(req => req.employeeId === employeeId.toString())
      .map(req => ({ ...req }))
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
  }

  async create(requestData) {
    await delay(400);
    const maxId = Math.max(...this.timeOffRequests.map(req => req.Id), 0);
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      status: "pending",
      requestDate: new Date().toISOString()
    };
    this.timeOffRequests.push(newRequest);
    return { ...newRequest };
  }

  async update(id, updateData) {
    await delay(400);
    const index = this.timeOffRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time off request with Id ${id} not found`);
    }
    this.timeOffRequests[index] = { ...this.timeOffRequests[index], ...updateData };
    return { ...this.timeOffRequests[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.timeOffRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time off request with Id ${id} not found`);
    }
    this.timeOffRequests.splice(index, 1);
    return true;
  }

  async getPendingRequests(employeeId) {
    await delay(250);
    return this.timeOffRequests
      .filter(req => req.employeeId === employeeId.toString() && req.status === "pending")
      .map(req => ({ ...req }));
  }
}

export default new TimeOffService();