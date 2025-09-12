const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeOffService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'time_off_request_c';
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        orderBy: [{"fieldName": "request_date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching time off requests:", error);
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
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "request_date_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Time off request with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching time off request ${id}:`, error);
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
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}
        ],
        orderBy: [{"fieldName": "request_date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching time off requests by employee:", error);
      throw error;
    }
  }

  async create(requestData) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: requestData.Name || `Time Off Request - ${requestData.start_date_c}`,
          employee_id_c: parseInt(requestData.employee_id_c),
          start_date_c: requestData.start_date_c,
          end_date_c: requestData.end_date_c,
          reason_c: requestData.reason_c,
          status_c: "pending",
          request_date_c: new Date().toISOString()
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
          console.error(`Failed to create time off request:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create time off request");
    } catch (error) {
      console.error("Error creating time off request:", error);
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
      if (updateData.start_date_c !== undefined) updateRecord.start_date_c = updateData.start_date_c;
      if (updateData.end_date_c !== undefined) updateRecord.end_date_c = updateData.end_date_c;
      if (updateData.reason_c !== undefined) updateRecord.reason_c = updateData.reason_c;
      if (updateData.status_c !== undefined) updateRecord.status_c = updateData.status_c;
      if (updateData.request_date_c !== undefined) updateRecord.request_date_c = updateData.request_date_c;

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
          console.error(`Failed to update time off request ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error(`Time off request with Id ${id} not found`);
    } catch (error) {
      console.error(`Error updating time off request ${id}:`, error);
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
          console.error(`Failed to delete time off request ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting time off request ${id}:`, error);
      throw error;
    }
  }

  async getPendingRequests(employeeId) {
    await delay(250);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["pending"]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching pending time off requests:", error);
      throw error;
    }
  }
}

export default new TimeOffService();