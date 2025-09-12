const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ScheduleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'schedule_c';
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "location_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "location_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Schedule with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  }

  async getByEmployeeId(employeeId) {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "location_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules by employee:", error);
      throw error;
    }
  }

  async getTodaySchedule(employeeId) {
    await delay(200);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "location_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]},
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [today]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const schedules = response.data || [];
      return schedules.length > 0 ? schedules[0] : null;
    } catch (error) {
      console.error("Error fetching today's schedule:", error);
      return null;
    }
  }

  async getUpcomingSchedules(employeeId, days = 7) {
    await delay(300);
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(new Date().getDate() + days);
      const endDate = futureDate.toISOString().split('T')[0];

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "location_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]},
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [today]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming schedules:", error);
      throw error;
    }
  }

  async create(scheduleData) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: scheduleData.Name || `Schedule - ${scheduleData.date_c}`,
          employee_id_c: parseInt(scheduleData.employee_id_c),
          date_c: scheduleData.date_c,
          start_time_c: scheduleData.start_time_c,
          end_time_c: scheduleData.end_time_c,
          position_c: scheduleData.position_c,
          location_c: scheduleData.location_c
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create schedule:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create schedule");
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    await delay(400);
    try {
      const updateRecord = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.employee_id_c !== undefined) updateRecord.employee_id_c = parseInt(updateData.employee_id_c);
      if (updateData.date_c !== undefined) updateRecord.date_c = updateData.date_c;
      if (updateData.start_time_c !== undefined) updateRecord.start_time_c = updateData.start_time_c;
      if (updateData.end_time_c !== undefined) updateRecord.end_time_c = updateData.end_time_c;
      if (updateData.position_c !== undefined) updateRecord.position_c = updateData.position_c;
      if (updateData.location_c !== undefined) updateRecord.location_c = updateData.location_c;

      const params = {
        records: [updateRecord]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update schedule ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error(`Schedule with Id ${id} not found`);
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await delay(300);
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete schedule ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  }
}

export default new ScheduleService();