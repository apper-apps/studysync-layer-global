import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import GradeProgress from "@/components/molecules/GradeProgress";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CourseCard = ({ course, upcomingCount, onClick }) => {
  const currentGrade = course.currentGrade || 0;

  return (
    <Card hover onClick={onClick} className="relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
        style={{ backgroundColor: course.color }}
      />
      
      <Card.Header className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {course.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{course.code}</p>
            <div className="flex items-center text-xs text-gray-400 space-x-4">
              <div className="flex items-center">
                <ApperIcon name="User" size={12} className="mr-1" />
                {course.instructor}
              </div>
              <div className="flex items-center">
                <ApperIcon name="BookOpen" size={12} className="mr-1" />
                {course.credits} credits
              </div>
            </div>
          </div>
          <GradeProgress grade={currentGrade} size="sm" />
        </div>
      </Card.Header>

      <Card.Content className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <ApperIcon name="Clock" size={14} className="mr-1" />
              <span>{upcomingCount} upcoming</span>
            </div>
{course.schedule && Array.isArray(course.schedule) && course.schedule.length > 0 && (
              <Badge variant="default" className="text-xs">
                {course.schedule[0]}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {currentGrade > 0 ? `${currentGrade}%` : "No Grade"}
            </div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CourseCard;