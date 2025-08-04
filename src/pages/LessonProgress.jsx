"use client"

import { useState, useEffect, Fragment } from "react"
import ProgressBar from "../components/common/progressBar"
import { AlertTriangle, ChevronDown, ChevronRight, Upload } from "lucide-react"
import { Snackbar, Alert } from "@mui/material"
import { getLessonProgress, getLessonUsers, resetTrainingProgress, createLesson, getAllRestaurants, getMenus, bulkUploadLessons } from "../services/lessonProgress"
import { v4 as uuidv4 } from "uuid";


export default function LessonProgress() {
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showResetOptions, setShowResetOptions] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState("All Restaurants")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState({
    activeEmployees: 0,
    inActiveEmployees: 0,
    overDueEmployees: 0,
    foodKnowledge: 0,
    foodUnits: {},
    wineKnowledge: 0,
    wineUnits: {},
    recentActivities: []
  })
  const [users, setUsers] = useState([])
  const [showLessonDrawer, setShowLessonDrawer] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    category: "food",
    unit: 1,
    unit_name: "",
    chapter: 1,
    chapter_name: "",
    questions: [],
    glossary: '',
    difficulty: "beginner",
    content: { section1: "", section2: "" },
    restaurant_uuid: "92cd5a0a-cf6e-4639-a2eb-ed831427dccd",
    menu_items: []
  });
  const [questionDraft, setQuestionDraft] = useState({
    question_text: "",
    hint: "",
    question_type: "multiple_choice",
    options_variable: [""],
    correct_answer_variable: [""],
    difficulty: "easy",
    repeat_for: { key_variable: "", source: "" }
  });
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState("");
  const [lessonSuccess, setLessonSuccess] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const ACTIVITIES_PER_PAGE = 10;
  const [showAllFoodUnits, setShowAllFoodUnits] = useState(false);
  const [showAllWineUnits, setShowAllWineUnits] = useState(false);
  const [questionDraftError, setQuestionDraftError] = useState({});
  const [lessonFormErrors, setLessonFormErrors] = useState({});
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const userRole = localStorage.getItem("userRole");

  const fetchLessonProgress = async () => {
    try {
      const [progressData, usersData, restaurantsData] = await Promise.all([
        getLessonProgress(),
        getLessonUsers(),
        getAllRestaurants()
      ]);
      setProgressData(progressData);
      setUsers(usersData.usersWithDetails);
      setRestaurants(restaurantsData.restaurants || restaurantsData);
      setMenus(restaurantsData.menus || restaurantsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonProgress();
  }, []);

  useEffect(() => {
    if (showLessonDrawer) {
      getAllRestaurants().then(data => setRestaurants(data.restaurants || data)).catch(() => setRestaurants([]));
      getMenus().then(data => setMenus(data.menus || data)).catch(() => setMenus([]));
    }
  }, [showLessonDrawer]);

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId])
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(users.map((user) => user.uuid))
    } else {
      setSelectedEmployees([])
    }
  }

  const handleResetTraining = async (type) => {
    try {
      const resetUsers = selectedEmployees.length === users.length ? "all" : selectedEmployees;
      await resetTrainingProgress(resetUsers, type);

      // Refresh the data after reset
      const [progressData, usersData] = await Promise.all([
        getLessonProgress(),
        getLessonUsers()
      ]);
      setProgressData(progressData)
      setUsers(usersData.usersWithDetails)

      setShowResetOptions(false);
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error in handleResetTraining:', error);
    }
  }

  const toggleHistory = (employeeId) => {
    if (expandedHistory === employeeId) {
      setExpandedHistory(null)
    } else {
      setExpandedHistory(employeeId)
    }
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())
    const matchesRestaurant = selectedRestaurant === "All Restaurants" ||
      user.restaurants.some(r => r.name === selectedRestaurant)
    const matchesStatus = selectedStatus === "All Statuses" ||
      (selectedStatus === "On Track" ? user.status === "On Track" : user.status === "Overdue")
    return matchesSearch && matchesRestaurant && matchesStatus
  })

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLessonFormChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    setLessonFormErrors(prev => ({ ...prev, [name]: undefined }));
  };
  const handleLessonContentChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, content: { ...prev.content, [name]: value } }));
  };
  const validateQuestionDraft = (q) => {
    const err = {};
    if (!q.question_text) err.question_text = 'Question text is required.';
    if (!q.question_type) err.question_type = 'Type is required.';
    if (!q.difficulty) err.difficulty = 'Difficulty is required.';
    if (q.question_type === 'single_select' || q.question_type === 'multiple_choice') {
      if (!q.options_variable || q.options_variable.length < 2 || q.options_variable.some(opt => !opt)) {
        err.options_variable = 'At least two options are required, none can be empty.';
      }
      if (!q.correct_answer_variable || q.correct_answer_variable.length < 1 || q.correct_answer_variable.some(ans => !ans)) {
        err.correct_answer_variable = 'At least one correct answer is required, none can be empty.';
      }
    } else {
      if (!q.correct_answer_variable || q.correct_answer_variable.some(ans => !ans)) {
        err.correct_answer_variable = 'Correct answer is required.';
      }
    }
    return err;
  };

  const handleAddQuestion = () => {
    const err = validateQuestionDraft(questionDraft);
    setQuestionDraftError(err);
    if (Object.keys(err).length > 0) return;
    setLessonForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { ...questionDraft, uuid: uuidv4() }
      ]
    }));
    setQuestionDraft({
      question_text: "",
      hint: "",
      question_type: "multiple_choice",
      options_variable: [""],
      correct_answer_variable: [""],
      difficulty: "easy",
      repeat_for: { key_variable: "", source: "" }
    });
    setQuestionDraftError({});
  };
  const handleQuestionDraftChange = (e) => {
    const { name, value } = e.target;
    setQuestionDraft((prev) => ({ ...prev, [name]: value }));
  };
  const handleQuestionOptionsChange = (idx, value) => {
    setQuestionDraft((prev) => {
      const options = [...prev.options_variable];
      options[idx] = value;
      return { ...prev, options_variable: options };
    });
  };
  const handleCorrectAnswerChange = (idx, value) => {
    setQuestionDraft((prev) => {
      const answers = [...prev.correct_answer_variable];
      answers[idx] = value;
      return { ...prev, correct_answer_variable: answers };
    });
  };
  const handleAddOption = () => {
    setQuestionDraft((prev) => ({ ...prev, options_variable: [...prev.options_variable, ""] }));
  };
  const handleAddCorrectAnswer = () => {
    setQuestionDraft((prev) => ({ ...prev, correct_answer_variable: [...prev.correct_answer_variable, ""] }));
  };
  const handleRemoveQuestion = (idx) => {
    setLessonForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };
  const validateLessonForm = (form) => {
    const errors = {};
    if (!form.category) errors.category = 'Category is required.';
    if (!form.unit) errors.unit = 'Unit is required.';
    if (!form.unit_name) errors.unit_name = 'Unit name is required.';
    if (!form.chapter) errors.chapter = 'Chapter is required.';
    if (!form.chapter_name) errors.chapter_name = 'Chapter name is required.';
    if (!form.restaurant_uuid) errors.restaurant_uuid = 'Restaurant is required.';
    if (!form.menu_items || form.menu_items.length === 0) errors.menu_items = 'At least one menu item is required.';
    if (!form.difficulty) errors.difficulty = 'Difficulty is required.';
    if (!form.content || !form.content.section1) errors.content = { section1: 'Content Section 1 is required.' };
    if (!form.questions || form.questions.length < 1) {
      errors.questions = 'At least one question is required.';
    } else {
      errors.questions = [];
      form.questions.forEach((q, idx) => {
        const qErr = {};
        if (!q.question_text) qErr.question_text = 'Question text is required.';
        if (!q.question_type) qErr.question_type = 'Type is required.';
        if (!q.difficulty) qErr.difficulty = 'Difficulty is required.';
        if ((q.question_type === 'single_select' || q.question_type === 'multiple_choice')) {
          if (!q.options_variable || q.options_variable.length < 2 || q.options_variable.some(opt => !opt)) {
            qErr.options_variable = 'At least two options are required, none can be empty.';
          }
          if (!q.correct_answer_variable || q.correct_answer_variable.length < 1 || q.correct_answer_variable.some(ans => !ans)) {
            qErr.correct_answer_variable = 'At least one correct answer is required, none can be empty.';
          }
        } else {
          if (!q.correct_answer_variable || q.correct_answer_variable.some(ans => !ans)) {
            qErr.correct_answer_variable = 'Correct answer is required.';
          }
        }
        errors.questions[idx] = qErr;
      });
      if (errors.questions.every(qe => Object.keys(qe).length === 0)) delete errors.questions;
    }
    return errors;
  };
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setLessonLoading(true);
    setLessonError("");
    setLessonSuccess("");
    const errors = validateLessonForm(lessonForm);
    setLessonFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLessonLoading(false);
      setLessonError('Please fix the errors in the form.');
      return;
    }
    try {
      await createLesson(lessonForm);
      setLessonSuccess("Lesson created successfully!");
      setLessonForm({
        category: "food",
        unit: 1,
        unit_name: "",
        chapter: 1,
        chapter_name: "",
        questions: [],
        glossary: {},
        difficulty: "beginner",
        content: { section1: "", section2: "" },
        restaurant_uuid: "92cd5a0a-cf6e-4639-a2eb-ed831427dccd",
        menu_items: []
      });
      setTimeout(() => setShowLessonDrawer(false), 1000);
    } catch (err) {
      setLessonError("Failed to create lesson");
      console.log(lessonFormErrors);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }

    const allowedMimeTypes = [
      'application/json'
    ];
    const allowedExtensions = ['.json'];
    const fileExtension = `.${selectedFile.name.split('.').pop().toLowerCase()}`;

    if (!allowedMimeTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadError('Please upload JSON file (.json)');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await bulkUploadLessons(formData, 'lesson');
      setShowBulkUploadModal(false);
      setSelectedFile(null);
      setSnackbarMessage("Bulk upload successful!");
      setSnackbarOpen(true);
      fetchLessonProgress();
    } catch (error) {
      setUploadError(error?.response?.data?.error || 'Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 overflow-auto">
        <main className="p-6 space-y-6">
          {/* Stats Overview */}
          <div style={{ alignItems: "end", justifyContent: "end" }} className="flex gap-2">
            {userRole === "super_admin" && <button style={{ backgroundColor: "transparent", color: "#000" }}
              className="bg-primary text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-primary/90 flex items-center gap-2"
              onClick={() => setShowBulkUploadModal(true)}
            >
              <Upload size={20} />
              Bulk Upload
            </button>}
            <button
              className="bg-primary text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-primary/90"
              onClick={() => setShowLessonDrawer(true)}
            >
              Create New Lesson
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4 text-left">Total Employees in Training</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-4xl font-bold">{progressData.activeEmployees}</p>
                  <p className="text-sm text-gray-500">Active Trainees</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-400">{progressData.inActiveEmployees}</p>
                  <p className="text-sm text-gray-500">Inactive</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-left">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Overdue Employees</h2>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">{progressData.overDueEmployees}</p>
                <p className="text-sm text-gray-500">out of {progressData.activeEmployees} active trainees</p>
              </div>
            </div>
          </div>

          {/* Lesson Completion Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4 text-left">Lesson Completion Overview</h2>

            <div className="space-y-6">
              {/* Food Knowledge */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Food Knowledge</h3>
                  <span className="font-medium">{(progressData.foodKnowledge).toFixed(2)}%</span>
                </div>
                <ProgressBar
                  variant="dark"
                  showLabel={false}
                  value={progressData.foodKnowledge}
                  max={100}
                  className="h-2 bg-gray-200"
                  progressClassName="bg-gray-900"
                />

                <div className="mt-4 space-y-4 relative">
                  {(showAllFoodUnits
                    ? Object.entries(progressData.foodUnits)
                    : Object.entries(progressData.foodUnits).slice(0, 3)
                  ).map(([unitName, unitData]) => (
                    <div key={unitName}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{unitName}</span>
                        <span>{unitData.completedChapters}/{unitData.totalChapters} chapters</span>
                      </div>
                      <ProgressBar
                        variant="dark"
                        showLabel={false}
                        value={(unitData.completedChapters / unitData.totalChapters) * 100}
                        max={100}
                        className="h-2 bg-gray-200"
                        progressClassName="bg-gray-900"
                      />
                    </div>
                  ))}
                  {Object.keys(progressData.foodUnits).length > 3 && (
                    <div className="flex justify-end mt-2">
                      <button
                        className="text-primary text-sm font-semibold px-4 py-2 hover:underline focus:outline-none"
                        onClick={() => setShowAllFoodUnits((prev) => !prev)}
                      >
                        {showAllFoodUnits ? 'Show less' : 'Show more...'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Wine Knowledge */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Wine Knowledge</h3>
                  <span className="font-medium">{(progressData.wineKnowledge).toFixed(2)}%</span>
                </div>
                <ProgressBar
                  variant="dark"
                  showLabel={false}
                  value={progressData.wineKnowledge}
                  max={100}
                  className="h-2 bg-gray-200"
                  progressClassName="bg-gray-900"
                />
                <div className="mt-4 space-y-4 relative">
                  {(showAllWineUnits
                    ? Object.entries(progressData.wineUnits)
                    : Object.entries(progressData.wineUnits).slice(0, 3)
                  ).map(([unitName, unitData]) => (
                    <div key={unitName}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{unitName}</span>
                        <span>{unitData.completedChapters}/{unitData.totalChapters} chapters</span>
                      </div>
                      <ProgressBar
                        variant="dark"
                        showLabel={false}
                        value={(unitData.completedChapters / unitData.totalChapters) * 100}
                        max={100}
                        className="h-2 bg-gray-200"
                        progressClassName="bg-gray-900"
                      />
                    </div>
                  ))}
                  {Object.keys(progressData.wineUnits).length > 3 && (
                    <div className="flex justify-end mt-2">
                      <button
                        className="text-primary text-sm font-semibold px-4 py-2 hover:underline focus:outline-none"
                        onClick={() => setShowAllWineUnits((prev) => !prev)}
                      >
                        {showAllWineUnits ? 'Show less' : 'Show more...'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Training Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4 text-left">Recent Training Activity</h2>
            <div className="space-y-4 relative">
              <div className="border rounded-lg p-4 bg-gray-50">
                {progressData.recentActivities.length > 0 ? (
                  progressData.recentActivities
                    .slice((activitiesPage - 1) * ACTIVITIES_PER_PAGE, activitiesPage * ACTIVITIES_PER_PAGE)
                    .map((activity) => {
                      const isCompleted = activity.details?.isCompleted;
                      const user = activity.user_uuid;
                      const lesson = activity.details?.lesson_uuid;
                      const name = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
                      const actionText = isCompleted
                        ? `completed ${lesson?.category === 'food' ? 'Food' : 'Wine'} Unit ${lesson?.unit}, Chapter ${lesson?.chapter}`
                        : `started ${lesson?.category === 'food' ? 'Food' : 'Wine'} Unit ${lesson?.unit}, Chapter ${lesson?.chapter}`;
                      const timeAgo = activity.timestamp ? formatDate(activity.timestamp) : '';
                      return (
                        <div key={activity._id} className="flex items-start text-left mb-4 last:mb-0">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3" style={{ background: '#990033' }}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                              <circle cx="10" cy="10" r="10" fill="#990033" />
                              <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm"><span className="font-medium">{name}</span> {actionText}</p>
                            <p className="text-xs text-gray-500">{timeAgo}</p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-500 text-center">No recent activities</p>
                )}
                {/* Pagination Controls */}
                {progressData.recentActivities.length > ACTIVITIES_PER_PAGE && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                      onClick={() => setActivitiesPage((p) => Math.max(1, p - 1))}
                      disabled={activitiesPage === 1}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {activitiesPage} of {Math.ceil(progressData.recentActivities.length / ACTIVITIES_PER_PAGE)}
                    </span>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                      onClick={() => setActivitiesPage((p) => Math.min(Math.ceil(progressData.recentActivities.length / ACTIVITIES_PER_PAGE), p + 1))}
                      disabled={activitiesPage === Math.ceil(progressData.recentActivities.length / ACTIVITIES_PER_PAGE)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Employee Training Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Employee Training Status</h2>
              <div className="relative">
                {userRole === 'super_admin' && <button
                  onClick={() => setShowResetOptions(!showResetOptions)}
                  disabled={selectedEmployees.length === 0}
                  className={`flex items-center px-4 py-2 rounded-md ${selectedEmployees.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white"
                    }`}
                >
                  Reset Training for {selectedEmployees.length} Selected
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                }
                {showResetOptions && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium">Reset Options</h3>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => handleResetTraining("all")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset All Training
                      </button>
                      <button
                        onClick={() => handleResetTraining("food")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Reset Food Training
                      </button>
                      <button
                        onClick={() => handleResetTraining("wine")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Reset Wine Training
                      </button>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex items-center text-amber-600 text-xs mb-3">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        This action cannot be undone
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => setShowResetOptions(false)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResetTraining("all")}
                          className="px-3 py-1 text-sm bg-primary text-white rounded-md"
                        >
                          Confirm Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex mb-4 space-x-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="relative">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option>All Restaurants</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.uuid || restaurant.id} value={restaurant.name}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option>All Statuses</option>
                  <option>On Track</option>
                  <option>Overdue</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="bg-trbackground">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        onChange={handleSelectAll}
                        checked={selectedEmployees.length === users.length && users.length > 0}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Food Knowledge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Wine Knowledge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Training
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Lesson History
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, i) => (
                    <Fragment key={i}>
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            onChange={() => handleSelectEmployee(user.uuid)}
                            checked={selectedEmployees.includes(user.uuid)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 text-left">
                            {user.first_name} {user.last_name}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {/* Restaurant names with tooltip if more than 2, or 'No Restaurant' if none */}
                          <div className="text-sm text-gray-900 text-left relative group cursor-pointer">
                            {user.restaurants && user.restaurants.length > 0 ? (
                              <>
                                {user.restaurants.slice(0, 2).map(r => r.name).join(", ")}
                                {user.restaurants.length > 2 && (
                                  <span>
                                    {`, +${user.restaurants.length - 2} more`}
                                    <span className="absolute z-20 left-0 mt-1 w-max min-w-[120px] max-w-xs bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-pre-line shadow-lg" style={{ top: '100%' }}>
                                      {user.restaurants.map(r => r.name).join(', ')}
                                    </span>
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">No Restaurant</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Food</span>
                              <span>{(user.foodKnowledge).toFixed(2)}%</span>
                            </div>
                            <ProgressBar
                              variant="dark"
                              showLabel={false}
                              value={user.foodKnowledge}
                              max={100}
                              className="h-2 bg-gray-200"
                              progressClassName="bg-gray-900"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Wine</span>
                              <span>{(user.wineKnowledge).toFixed(2)}%</span>
                            </div>
                            <ProgressBar
                              variant="dark"
                              showLabel={false}
                              value={user.wineKnowledge}
                              max={100}
                              className="h-2 bg-gray-200"
                              progressClassName="bg-gray-900"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "On Track"
                              ? "bg-yellow-300 text-gray-800"
                              : "bg-[#990033] text-white"
                              }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Training</span>
                              <span>{(user.training).toFixed(2)}%</span>
                            </div>
                            <ProgressBar
                              variant="dark"
                              showLabel={false}
                              value={user.training}
                              max={100}
                              className="h-2 bg-gray-200"
                              progressClassName="bg-gray-900"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <select
                              defaultValue={user.frequency}
                              className="appearance-none bg-background pl-2 pr-8 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                              <option value={1}>1 day</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleHistory(user.uuid)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedHistory === user.uuid ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedHistory === user.uuid && (
                        <tr key={i}>
                          <td colSpan="9" className="px-4 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900">Lesson History</h3>
                              {user.lessonHistory && user.lessonHistory.length > 0 ? (
                                <div className="space-y-3">
                                  {user.lessonHistory.map((lesson, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                    >
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {lesson.category === 'food' ? 'Food' : 'Wine'} Unit {lesson.unit}, Chapter {lesson.chapter}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1" style={{ textAlign: 'left' }}>
                                          {lesson.progress.status} {formatDate(lesson.progress.completedAt)}
                                        </div>
                                      </div>
                                      <div>
                                        <span
                                          className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${lesson.progress.completedAt > lesson.progress.dueDate
                                            ? "bg-[#e1e1e1] text-black"
                                            : "bg-[#e1e1e1] text-black"
                                            }`}
                                        >
                                          {lesson.progress.completedAt > lesson.progress.dueDate ? 'Overdue' : 'On Track'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">No lesson history available for this employee</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {showLessonDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowLessonDrawer(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textcolor">Create New Lesson</h2>
              <button onClick={() => setShowLessonDrawer(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-textcolor"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleLessonSubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={lessonForm.category} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="food">Food</option>
                      <option value="wine">Wine</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select name="difficulty" value={lessonForm.difficulty} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
                    <select name="restaurant_uuid" value={lessonForm.restaurant_uuid} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Select Restaurant</option>
                      {restaurants.map(r => (
                        <option key={r.uuid || r.id} value={r.uuid || r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu</label>
                    <select
                      name="menu_items"
                      value={lessonForm.menu_items[0] || ""}
                      onChange={e => setLessonForm(prev => ({ ...prev, menu_items: [e.target.value] }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Menu</option>
                      {menus.map(m => (
                        <option key={m.uuid || m.id} value={m.uuid || m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input name="unit" type="number" value={lessonForm.unit} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Name</label>
                    <input name="unit_name" value={lessonForm.unit_name} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <input name="chapter" type="number" value={lessonForm.chapter} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                    <input name="chapter_name" value={lessonForm.chapter_name} onChange={handleLessonFormChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Section 1</label>
                  <input name="section1" value={lessonForm.content.section1} onChange={handleLessonContentChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Section 2</label>
                  <input name="section2" value={lessonForm.content.section2} onChange={handleLessonContentChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Questions</h3>
                  {lessonForm.questions.map((q, idx) => (
                    <div key={q.uuid} className="border p-2 mb-2 rounded bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">{q.question_text}</div>
                        <button type="button" className="text-red-500" onClick={() => handleRemoveQuestion(idx)}>Remove</button>
                      </div>
                      <div className="text-xs text-gray-500">Type: {q.question_type}, Difficulty: {q.difficulty}</div>
                      <div className="text-xs">Options: {q.options_variable.join(", ")}</div>
                      <div className="text-xs">Correct: {q.correct_answer_variable.join(", ")}</div>
                      {q.hint && <div className="text-xs text-blue-600 mt-1">Hint: {q.hint}</div>}
                    </div>
                  ))}
                  <div className="border p-2 rounded mt-2">
                    <input
                      placeholder="Question Text"
                      name="question_text"
                      value={questionDraft.question_text}
                      onChange={handleQuestionDraftChange}
                      className={`w-full p-2 border ${questionDraftError.question_text ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2`}
                    />
                    {questionDraftError.question_text && <div className="text-red-500 text-xs mb-1">{questionDraftError.question_text}</div>}
                    <div className="mb-2">
                      <input
                        placeholder="Hint (optional)"
                        name="hint"
                        value={questionDraft.hint || ''}
                        onChange={e => setQuestionDraft(prev => ({ ...prev, hint: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="flex space-x-2 mb-2">
                      <select name="question_type" value={questionDraft.question_type} onChange={handleQuestionDraftChange} className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="single_select">Single Select</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text">Text</option>
                        <option value="true_false">True/False</option>
                        <option value="fill_in_the_blank">Fill in the Blank</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                      <select name="difficulty" value={questionDraft.difficulty} onChange={handleQuestionDraftChange} className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    {/* Show options only for single_select and multiple_choice */}
                    {(questionDraft.question_type === "single_select" || questionDraft.question_type === "multiple_choice") && (
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Options</label>
                        {questionDraft.options_variable.map((opt, idx) => (
                          <div key={idx} className="relative">
                            <input
                              value={opt}
                              onChange={e => handleQuestionOptionsChange(idx, e.target.value)}
                              className={`w-full p-2 border ${questionDraftError.options_variable ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-1`}
                              placeholder={`Option ${idx + 1}`}
                            />
                            {/* Show error only for the first field if options error exists */}
                            {idx === 0 && questionDraftError.options_variable && <div className="text-red-500 text-xs mb-1">{questionDraftError.options_variable}</div>}
                          </div>
                        ))}
                        <button type="button" className="text-blue-500 ml-2" onClick={handleAddOption}>+ Option</button>
                      </div>
                    )}
                    {/* Show correct answers for all types */}
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Correct Answers</label>
                      {questionDraft.correct_answer_variable.map((ans, idx) => (
                        <div key={idx} className="relative">
                          <input
                            value={ans}
                            onChange={e => handleCorrectAnswerChange(idx, e.target.value)}
                            className={`w-full p-2 border ${questionDraftError.correct_answer_variable ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-1`}
                            placeholder={`Correct ${idx + 1}`}
                          />
                          {/* Show error only for the first field if correct answer error exists */}
                          {idx === 0 && questionDraftError.correct_answer_variable && <div className="text-red-500 text-xs mb-1">{questionDraftError.correct_answer_variable}</div>}
                        </div>
                      ))}
                      <button type="button" className="text-blue-500 ml-2" onClick={handleAddCorrectAnswer}>+ Correct</button>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Repeat For (optional)</label>
                      <div className="flex space-x-2">
                        <input
                          placeholder="Key Variable"
                          value={questionDraft.repeat_for.key_variable}
                          onChange={e => setQuestionDraft(prev => ({ ...prev, repeat_for: { ...prev.repeat_for, key_variable: e.target.value } }))}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <input
                          placeholder="Source"
                          value={questionDraft.repeat_for.source}
                          onChange={e => setQuestionDraft(prev => ({ ...prev, repeat_for: { ...prev.repeat_for, source: e.target.value } }))}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    {/* Add Question Button and Validation Errors */}
                    <button type="button" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90" onClick={handleAddQuestion}>Add Question</button>

                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Glossary</label>
                  <input name="glossary" defaultValue={JSON.stringify(lessonForm?.glossary)} onChange={e => setLessonForm(prev => ({ ...prev, glossary: e?.target?.value }))} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                {/* Hide Create Lesson button until at least one question is added */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button type="button" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setShowLessonDrawer(false)}>Cancel</button>
                  {lessonForm.questions.length > 0 && (
                    <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90" disabled={lessonLoading}>{lessonLoading ? "Creating..." : "Create Lesson"}</button>
                  )}
                </div>
                {lessonError && <div className="text-red-500 text-sm mt-2">{lessonError}</div>}
                {lessonSuccess && <div className="text-green-600 text-sm mt-2">{lessonSuccess}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowBulkUploadModal(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textcolor">Bulk Upload Lessons</h2>
              <button onClick={() => setShowBulkUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-textcolor"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload JSON File</h3>
                  <p className="text-sm text-gray-500">
                    Upload JSON file containing lesson information. Make sure to follow the correct format.
                  </p>
                </div>

                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${dragActive ? 'bg-gray-100' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>{selectedFile ? selectedFile.name : 'Upload a file'}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".json"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JSON up to 10MB</p>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {uploadError}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowBulkUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBulkUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Lessons'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  )
}
