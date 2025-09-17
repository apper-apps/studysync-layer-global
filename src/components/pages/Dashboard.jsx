import React, { useEffect, useState } from "react";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { format, isAfter, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import QuickAddButton from "@/components/organisms/QuickAddButton";
import CourseModal from "@/components/organisms/CourseModal";
import Assignments from "@/components/pages/Assignments";
import Courses from "@/components/pages/Courses";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import GradeProgress from "@/components/molecules/GradeProgress";
import StatusBadge from "@/components/molecules/StatusBadge";

const Dashboard = () => {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { assignments, loading: assignmentsLoading, error: assignmentsError, updateAssignmentStatus } = useAssignments();
  
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    if (assignments.length > 0) {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const todaysTasksList = assignments.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return isToday(dueDate) && assignment.status !== "completed";
      });

const upcomingList = assignments.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate > today && dueDate <= nextWeek && assignment.status !== "completed";
      }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

      setTodaysTasks(todaysTasksList);
      setUpcomingAssignments(upcomingList);
    }
  }, [assignments]);

  const handleToggleTask = async (assignmentId, newStatus) => {
    await updateAssignmentStatus(assignmentId, newStatus);
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGrades = courses.reduce((sum, course) => {
      const gradePoints = getGradePoints(course.currentGrade || 0);
      return sum + (gradePoints * course.credits);
    }, 0);
    return totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : "0.00";
  };

  const getGradePoints = (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 65) return 0.7;
    return 0.0;
  };

  const getOverdueCount = () => {
return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return isAfter(new Date(), dueDate) && assignment.status !== "completed";
    }).length;
  };

  if (coursesLoading || assignmentsLoading) {
    return (
      <div className="p-6">
        <Loading type="dashboard" />
      </div>
    );
  }

  if (coursesError || assignmentsError) {
    return (
      <div className="p-6">
        <Error 
          message={coursesError || assignmentsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your studies today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <ApperIcon name="BookOpen" size={24} />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm font-medium">Overall GPA</p>
                <p className="text-3xl font-bold">{calculateOverallGPA()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <ApperIcon name="TrendingUp" size={24} />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 text-sm font-medium">Due Today</p>
                <p className="text-3xl font-bold">{todaysTasks.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <ApperIcon name="Clock" size={24} />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-r from-error-500 to-error-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold">{getOverdueCount()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <ApperIcon name="AlertTriangle" size={24} />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's Tasks */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                <p className="text-sm text-gray-500">Assignments due today</p>
              </div>
              <ApperIcon name="Calendar" className="text-accent-500" size={20} />
            </div>
          </Card.Header>
          <Card.Content>
            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                {todaysTasks.map((task) => {
                  const course = getCourseById(task.courseId);
                  return (
<div key={task.Id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => handleToggleTask(task.Id, "completed")}
                        className="p-1 rounded-full text-gray-400 hover:text-success-500 transition-colors mt-0.5"
                      >
                        <ApperIcon name="Circle" size={16} />
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{task.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {course && (
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: course.color }}
                              />
                              <span className="text-xs text-gray-500">{course.code}</span>
                            </div>
                          )}
                          <StatusBadge status="pending" showIcon={false} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle2" size={48} className="mx-auto text-success-500 mb-2" />
                <p className="text-gray-500">No tasks due today! Great job!</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
                <p className="text-sm text-gray-500">Next 7 days</p>
              </div>
              <ApperIcon name="Clock" className="text-primary-500" size={20} />
            </div>
          </Card.Header>
          <Card.Content>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const course = getCourseById(assignment.courseId);
                  return (
<div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {course && (
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: course.color }}
                              />
                              <span className="text-xs text-gray-500">{course.code}</span>
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            {format(new Date(assignment.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={assignment.status} showIcon={false} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No upcoming assignments</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Course Overview */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
              <p className="text-sm text-gray-500">Current grades and progress</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCourseModal(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Course
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{courses.map((course) => {
                const courseAssignments = assignments.filter(a => a.courseId === course.Id);
                const upcomingCount = courseAssignments.filter(a => 
                  new Date(a.dueDate) > new Date() && a.status !== "completed"
                ).length;
                return (
                  <div key={course.Id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">{course.code}</p>
                      </div>
                      <GradeProgress grade={course.currentGrade || 0} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{course.credits} credits</span>
                      <span>{upcomingCount} upcoming</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="BookOpen" size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">No courses added yet</p>
              <Button onClick={() => setShowCourseModal(true)}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Your First Course
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Quick Add Button */}
      <QuickAddButton
        onAddCourse={() => setShowCourseModal(true)}
        onAddAssignment={() => setShowAssignmentModal(true)}
        className="fixed bottom-6 right-6 z-10"
      />

      {/* Modals */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSave={() => setShowCourseModal(false)}
      />

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSave={() => setShowAssignmentModal(false)}
        courses={courses}
      />
    </div>
  );
};

export default Dashboard;