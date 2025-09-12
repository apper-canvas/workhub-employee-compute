import employeesData from "@/services/mockData/employees.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async getAll() {
    await delay(300);
    return [...this.employees];
  }

  async getById(id) {
    await delay(200);
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error(`Employee with Id ${id} not found`);
    }
    return { ...employee };
  }

  async getCurrentEmployee() {
    await delay(200);
    // In a real app, this would get the current authenticated user
    // For demo purposes, we'll return the first employee
    const employee = this.employees.find(emp => emp.Id === 1);
    return { ...employee };
  }

  async create(employeeData) {
    await delay(400);
    const maxId = Math.max(...this.employees.map(emp => emp.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData,
      startDate: new Date().toISOString().split('T')[0]
    };
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, updateData) {
    await delay(400);
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with Id ${id} not found`);
    }
    this.employees[index] = { ...this.employees[index], ...updateData };
    return { ...this.employees[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with Id ${id} not found`);
    }
    this.employees.splice(index, 1);
    return true;
  }
}

export default new EmployeeService();