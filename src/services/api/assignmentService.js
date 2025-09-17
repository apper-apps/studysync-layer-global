// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'assignment_c';

export const assignmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          {
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "name_c" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        notes: assignment.notes_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          {
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "name_c" } }
          }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        notes: assignment.notes_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      };
    } catch (error) {
      console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        notes: assignment.notes_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments by course ID:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getUpcoming(days = 7) {
    try {
      const now = new Date().toISOString();
      const future = new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString();

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [now]
          },
          {
            FieldName: "due_date_c",
            Operator: "LessThanOrEqualTo",
            Values: [future]
          },
          {
            FieldName: "status_c",
            Operator: "NotEqualTo",
            Values: ["completed"]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        notes: assignment.notes_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error getting upcoming assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getTodaysTasks() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startOfDay]
          },
          {
            FieldName: "due_date_c",
            Operator: "LessThan",
            Values: [endOfDay]
          },
          {
            FieldName: "status_c",
            Operator: "NotEqualTo",
            Values: ["completed"]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        dueDate: assignment.due_date_c || new Date().toISOString(),
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || null,
        notes: assignment.notes_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error getting today's tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          status_c: assignmentData.status || 'pending',
          grade_c: assignmentData.grade,
          notes_c: assignmentData.notes || '',
          course_id_c: assignmentData.courseId ? parseInt(assignmentData.courseId) : null
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const newAssignment = successfulRecords[0].data;
          return {
            Id: newAssignment.Id,
            title: newAssignment.title_c || newAssignment.Name || '',
            dueDate: newAssignment.due_date_c || new Date().toISOString(),
            priority: newAssignment.priority_c || 'medium',
            status: newAssignment.status_c || 'pending',
            grade: newAssignment.grade_c || null,
            notes: newAssignment.notes_c || '',
            courseId: newAssignment.course_id_c?.Id || newAssignment.course_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.title,
          title_c: updateData.title,
          due_date_c: updateData.dueDate,
          priority_c: updateData.priority,
          status_c: updateData.status,
          grade_c: updateData.grade,
          notes_c: updateData.notes || '',
          course_id_c: updateData.courseId ? parseInt(updateData.courseId) : null
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedAssignment = successfulUpdates[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c || updatedAssignment.Name || '',
            dueDate: updatedAssignment.due_date_c || new Date().toISOString(),
            priority: updatedAssignment.priority_c || 'medium',
            status: updatedAssignment.status_c || 'pending',
            grade: updatedAssignment.grade_c || null,
            notes: updatedAssignment.notes_c || '',
            courseId: updatedAssignment.course_id_c?.Id || updatedAssignment.course_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedAssignment = successfulUpdates[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c || updatedAssignment.Name || '',
            dueDate: updatedAssignment.due_date_c || new Date().toISOString(),
            priority: updatedAssignment.priority_c || 'medium',
            status: updatedAssignment.status_c || 'pending',
            grade: updatedAssignment.grade_c || null,
            notes: updatedAssignment.notes_c || '',
            courseId: updatedAssignment.course_id_c?.Id || updatedAssignment.course_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating assignment status:", error?.response?.data?.message || error);
      return null;
    }
  }
};