// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'grade_c';

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } },
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
      return response.data.map(grade => ({
        Id: grade.Id,
        title: grade.title_c || grade.Name || '',
        category: grade.category_c || '',
        score: grade.score_c || 0,
        weight: grade.weight_c || 0,
        date: grade.date_c || new Date().toISOString(),
        courseId: grade.course_id_c?.Id || grade.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } },
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

      const grade = response.data;
      return {
        Id: grade.Id,
        title: grade.title_c || grade.Name || '',
        category: grade.category_c || '',
        score: grade.score_c || 0,
        weight: grade.weight_c || 0,
        date: grade.date_c || new Date().toISOString(),
        courseId: grade.course_id_c?.Id || grade.course_id_c || null
      };
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } },
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

      return response.data.map(grade => ({
        Id: grade.Id,
        title: grade.title_c || grade.Name || '',
        category: grade.category_c || '',
        score: grade.score_c || 0,
        weight: grade.weight_c || 0,
        date: grade.date_c || new Date().toISOString(),
        courseId: grade.course_id_c?.Id || grade.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching grades by course ID:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.title,
          title_c: gradeData.title,
          category_c: gradeData.category,
          score_c: gradeData.score,
          weight_c: gradeData.weight,
          date_c: gradeData.date || new Date().toISOString(),
          course_id_c: gradeData.courseId ? parseInt(gradeData.courseId) : null
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
          const newGrade = successfulRecords[0].data;
          return {
            Id: newGrade.Id,
            title: newGrade.title_c || newGrade.Name || '',
            category: newGrade.category_c || '',
            score: newGrade.score_c || 0,
            weight: newGrade.weight_c || 0,
            date: newGrade.date_c || new Date().toISOString(),
            courseId: newGrade.course_id_c?.Id || newGrade.course_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
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
          category_c: updateData.category,
          score_c: updateData.score,
          weight_c: updateData.weight,
          date_c: updateData.date,
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
          const updatedGrade = successfulUpdates[0].data;
          return {
            Id: updatedGrade.Id,
            title: updatedGrade.title_c || updatedGrade.Name || '',
            category: updatedGrade.category_c || '',
            score: updatedGrade.score_c || 0,
            weight: updatedGrade.weight_c || 0,
            date: updatedGrade.date_c || new Date().toISOString(),
            courseId: updatedGrade.course_id_c?.Id || updatedGrade.course_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
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
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return false;
    }
  },

  async calculateCourseGrade(courseId, gradeCategories) {
    try {
      const courseGrades = await this.getByCourseId(courseId);
      
      if (courseGrades.length === 0) return 0;

      let totalWeightedScore = 0;
      let totalWeight = 0;

      gradeCategories.forEach(category => {
        const categoryGrades = courseGrades.filter(grade => grade.category === category.name);
        if (categoryGrades.length > 0) {
          const averageScore = categoryGrades.reduce((sum, grade) => sum + grade.score, 0) / categoryGrades.length;
          totalWeightedScore += averageScore * (category.weight / 100);
          totalWeight += category.weight / 100;
        }
      });

      return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    } catch (error) {
      console.error("Error calculating course grade:", error?.response?.data?.message || error);
      return 0;
    }
  }
};