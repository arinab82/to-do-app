import React, { useState, useEffect } from 'react';
import { 
  FaCheck, FaTrash, FaPlus, FaSearch, FaMoon, FaSun,
  FaChartBar, FaClock, FaExclamationTriangle, FaList,
  FaCalendar, FaTimes, FaUndo, FaFolderOpen,
  FaRegCheckCircle, FaRegClock, FaRegCalendar, FaRegFolder,
  FaTags, FaUser, FaBriefcase, FaGraduationCap,
  FaShoppingCart, FaHeart, FaFlag, FaStar,
  FaChevronRight, FaChevronLeft
} from 'react-icons/fa';
import { toJalaali, toGregorian, jalaaliMonthLength } from 'jalaali-js';
import './App.css';

function convertToPersianNumbers(num) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, digit => persianDigits[parseInt(digit)]);
}

function getPersianDate(dateInput) {
  if (!dateInput) return '';
  
  try {
    if (typeof dateInput === 'string' && dateInput.includes('فروردین')) {
      return dateInput;
    }
    
    let dateObj;
    if (typeof dateInput === 'string') {
      dateObj = new Date(dateInput);
    } else {
      dateObj = dateInput;
    }
    
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }
    
    const persianDate = toJalaali(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      dateObj.getDate()
    );
    
    const persianMonthNames = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    const day = convertToPersianNumbers(persianDate.jd);
    const monthName = persianMonthNames[persianDate.jm - 1];
    const year = convertToPersianNumbers(persianDate.jy);
    const hours = convertToPersianNumbers(dateObj.getHours().toString().padStart(2, '0'));
    const minutes = convertToPersianNumbers(dateObj.getMinutes().toString().padStart(2, '0'));
    
    return `${day} ${monthName} ${year} - ${hours}:${minutes}`;
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    return getPersianDate(new Date());
  }
}

function calculateDaysRemaining(dueDate) {
  if (!dueDate) return null;
  
  try {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return null;
  }
}

function PersianDatePicker({ value, onChange, placeholder }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const daysOfWeek = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const getJalaaliDate = (date = new Date()) => {
    return toJalaali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  };

  const getDaysInJalaaliMonth = (jalaali) => {
    return jalaaliMonthLength(jalaali.jy, jalaali.jm);
  };

  const handleDateSelect = (day, month, year) => {
    const gregorian = toGregorian(year, month, day);
    const selectedDate = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
    
    const formattedDate = selectedDate.toISOString().slice(0, 16);
    onChange(formattedDate);
    setShowDatePicker(false);
  };

  const nextMonth = () => {
    const jalaali = getJalaaliDate(currentDate);
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonthDate);
  };

  const prevMonth = () => {
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonthDate);
  };

  const jalaali = getJalaaliDate(currentDate);
  const daysInMonth = getDaysInJalaaliMonth(jalaali);
  
  // محاسبه روز اول ماه
  const firstDayGregorian = toGregorian(jalaali.jy, jalaali.jm, 1);
  const firstDayDate = new Date(firstDayGregorian.gy, firstDayGregorian.gm - 1, firstDayGregorian.gd);
  const firstDayOfWeek = firstDayDate.getDay(); // 0 = Sunday, 6 = Saturday
  
  // تبدیل به جمعه‌محور (شنبه = 0)
  const firstDay = (firstDayOfWeek + 1) % 7;

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const todayJalaali = getJalaaliDate(new Date());
  const isToday = (day) => {
    return day === todayJalaali.jd && 
           jalaali.jm === todayJalaali.jm && 
           jalaali.jy === todayJalaali.jy;
  };

  const isSelected = (day) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const selectedJalaali = getJalaaliDate(selectedDate);
    return day === selectedJalaali.jd && 
           jalaali.jm === selectedJalaali.jm && 
           jalaali.jy === selectedJalaali.jy;
  };

  return (
    <div className="persian-date-picker-container">
      <div 
        className="date-input-display"
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <FaCalendar className="date-input-icon" />
        {value ? getPersianDate(value) : placeholder}
      </div>
      
      {showDatePicker && (
        <div className="persian-date-picker-modal">
          <div className="date-picker-overlay" onClick={() => setShowDatePicker(false)}></div>
          <div className="persian-date-picker">
            <div className="date-picker-header">
              <button onClick={prevMonth} className="month-nav-btn">
                <FaChevronRight />
              </button>
              <span className="current-month">
                {persianMonths[jalaali.jm - 1]} {convertToPersianNumbers(jalaali.jy)}
              </span>
              <button onClick={nextMonth} className="month-nav-btn">
                <FaChevronLeft />
              </button>
            </div>
            
            <div className="days-of-week">
              {daysOfWeek.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>
            
            <div className="days-grid">
              {/* روزهای خالی قبل از شروع ماه */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="day empty"></div>
              ))}
              
              {/* روزهای ماه */}
              {days.map(day => (
                <div
                  key={day}
                  className={`day ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
                  onClick={() => handleDateSelect(day, jalaali.jm, jalaali.jy)}
                >
                  {convertToPersianNumbers(day)}
                </div>
              ))}
            </div>
            
            <div className="date-picker-actions">
              <button 
                className="today-btn"
                onClick={() => {
                  const today = new Date();
                  const todayJalaali = getJalaaliDate(today);
                  handleDateSelect(todayJalaali.jd, todayJalaali.jm, todayJalaali.jy);
                }}
              >
                انتخاب امروز
              </button>
              <button 
                className="clear-btn"
                onClick={() => {
                  onChange('');
                  setShowDatePicker(false);
                }}
              >
                حذف تاریخ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryPicker({ selectedValue, onValueChange }) {
  const categoryOptions = [
    { value: 'personal', label: 'شخصی', color: '#8b5cf6', icon: <FaUser /> },
    { value: 'work', label: 'کاری', color: '#06b6d4', icon: <FaBriefcase /> },
    { value: 'study', label: 'تحصیلی', color: '#10b981', icon: <FaGraduationCap /> },
    { value: 'shopping', label: 'خرید', color: '#f59e0b', icon: <FaShoppingCart /> },
    { value: 'health', label: 'سلامتی', color: '#ec4899', icon: <FaHeart /> }
  ];

  return (
    <div className="category-picker">
      <h4 className="picker-title">دسته‌بندی</h4>
      <div className="category-options">
        {categoryOptions.map(cat => (
          <div
            key={cat.value}
            className={`category-option ${selectedValue === cat.value ? 'is-selected' : ''}`}
            onClick={() => onValueChange(cat.value)}
            style={{ '--cat-color': cat.color }}
          >
            <div className="category-option-icon" style={{ background: cat.color }}>
              {cat.icon}
            </div>
            <span className="category-option-text">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityPicker({ selectedValue, onValueChange }) {
  const priorityOptions = [
    { value: 'low', label: 'کم', color: '#10b981', icon: <FaFlag /> },
    { value: 'medium', label: 'متوسط', color: '#f59e0b', icon: <FaStar /> },
    { value: 'high', label: 'بالا', color: '#ef4444', icon: <FaExclamationTriangle /> },
    { value: 'urgent', label: 'فوری', color: '#dc2626', icon: <FaTimes /> }
  ];

  return (
    <div className="priority-picker">
      <h4 className="picker-title">اولویت</h4>
      <div className="priority-options">
        {priorityOptions.map(priority => (
          <div
            key={priority.value}
            className={`priority-option ${selectedValue === priority.value ? 'is-selected' : ''}`}
            onClick={() => onValueChange(priority.value)}
            style={{ '--priority-color': priority.color }}
          >
            <div className="priority-option-icon" style={{ background: priority.color }}>
              {priority.icon}
            </div>
            <span className="priority-option-text">{priority.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [removedTasks, setRemovedTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('personal');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskTags, setTaskTags] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showTrash, setShowTrash] = useState(false);

  const categoryList = [
    { value: 'personal', label: 'شخصی', color: '#8b5cf6' },
    { value: 'work', label: 'کاری', color: '#06b6d4' },
    { value: 'study', label: 'تحصیلی', color: '#10b981' },
    { value: 'shopping', label: 'خرید', color: '#f59e0b' },
    { value: 'health', label: 'سلامتی', color: '#ec4899' }
  ];

  const priorityList = [
    { value: 'low', label: 'کم', color: '#10b981' },
    { value: 'medium', label: 'متوسط', color: '#f59e0b' },
    { value: 'high', label: 'بالا', color: '#ef4444' },
    { value: 'urgent', label: 'فوری', color: '#dc2626' }
  ];

  useEffect(() => {
    const storedTasks = localStorage.getItem('taskItems');
    const storedRemovedTasks = localStorage.getItem('removedTaskItems');
    const storedTheme = localStorage.getItem('appTheme');
    
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedRemovedTasks) setRemovedTasks(JSON.parse(storedRemovedTasks));
    if (storedTheme) setIsDarkTheme(JSON.parse(storedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem('taskItems', JSON.stringify(tasks));
    localStorage.setItem('removedTaskItems', JSON.stringify(removedTasks));
    localStorage.setItem('appTheme', JSON.stringify(isDarkTheme));
  }, [tasks, removedTasks, isDarkTheme]);

  const handleAddTask = () => {
    if (taskText.trim() === '') {
      alert('لطفا متن کار را وارد کنید!');
      return;
    }

    const tagsArray = taskTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const newTask = {
      id: Date.now() + Math.random(),
      text: taskText,
      category: taskCategory,
      priority: taskPriority,
      completed: false,
      createdAt: getPersianDate(new Date()),
      dueDate: taskDueDate,
      tags: tagsArray,
      isExpired: false
    };
    
    setTasks(previousTasks => [newTask, ...previousTasks]);
    
    setTaskText('');
    setTaskDueDate('');
    setTaskTags('');
    setTaskPriority('medium');
    setTaskCategory('personal');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (taskId) => {
    const taskToRemove = tasks.find(task => task.id === taskId);
    if (taskToRemove) {
      setRemovedTasks([...removedTasks, {
        ...taskToRemove,
        removedAt: getPersianDate(new Date())
      }]);
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const recoverTask = (taskId) => {
    const taskToRecover = removedTasks.find(task => task.id === taskId);
    if (taskToRecover) {
      setTasks([taskToRecover, ...tasks]);
      setRemovedTasks(removedTasks.filter(task => task.id !== taskId));
    }
  };

  const getFilteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (currentFilter) {
      case 'completed':
        return matchesSearch && task.completed;
      case 'pending':
        return matchesSearch && !task.completed;
      case 'urgent':
        return matchesSearch && task.priority === 'urgent';
      default:
        return matchesSearch;
    }
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  const getCategoryText = (categoryValue) => {
    return categoryList.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const getPriorityText = (priorityValue) => {
    return priorityList.find(p => p.value === priorityValue)?.label || priorityValue;
  };

  const getCategoryColor = (categoryValue) => {
    return categoryList.find(cat => cat.value === categoryValue)?.color || '#666';
  };

  const getPriorityColor = (priorityValue) => {
    return priorityList.find(p => p.value === priorityValue)?.color || '#666';
  };

  const showDate = (dateString) => {
    if (!dateString) return '';
    
    if (dateString.includes('فروردین') || dateString.includes('اردیبهشت') || 
        dateString.includes('خرداد') || dateString.includes('تیر') || 
        dateString.includes('مرداد') || dateString.includes('شهریور') || 
        dateString.includes('مهر') || dateString.includes('آبان') || 
        dateString.includes('آذر') || dateString.includes('دی') || 
        dateString.includes('بهمن') || dateString.includes('اسفند')) {
      return dateString;
    }
    
    return getPersianDate(dateString);
  };

  const getDaysRemaining = (dueDate) => {
    return calculateDaysRemaining(dueDate);
  };

  const getRemainingText = (days) => {
    if (days === null) return '';
    if (days < 0) return `${convertToPersianNumbers(Math.abs(days))} روز گذشته`;
    if (days === 0) return 'امروز';
    if (days === 1) return 'فردا';
    return `${convertToPersianNumbers(days)} روز باقی مانده`;
  };

  const getRemainingColor = (days) => {
    if (days === null) return 'var(--text-muted)';
    if (days < 0) return 'var(--error-color)';
    if (days === 0) return 'var(--warning-color)';
    if (days <= 3) return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  const clearAllData = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید؟')) {
      localStorage.removeItem('taskItems');
      localStorage.removeItem('removedTaskItems');
      setTasks([]);
      setRemovedTasks([]);
      alert('تمام داده‌ها پاک شدند.');
    }
  };

  return (
    <div className={`task-app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header className="app-header">
        <div className="header-container">
          <div className="app-brand">
            <h1>مدیریت کارها</h1>
          </div>
          <div className="header-controls">
            <button 
              className="control-btn"
              onClick={() => setShowTrash(!showTrash)}
              title="سطل بازیافت"
            >
              <FaFolderOpen />
              {removedTasks.length > 0 && (
                <span className="trash-badge">{convertToPersianNumbers(removedTasks.length)}</span>
              )}
            </button>
            <button 
              className="control-btn"
              onClick={clearAllData}
              title="پاک کردن همه"
              style={{ background: 'rgba(239, 68, 68, 0.2)' }}
            >
              <FaTrash />
            </button>
            <button 
              className="control-btn"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      {showTrash && (
        <div className="trash-modal">
          <div className="trash-content">
            <div className="trash-header">
              <h2>🗑️ سطل بازیافت</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowTrash(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            {removedTasks.length === 0 ? (
              <div className="empty-message">سطل بازیافت خالی است</div>
            ) : (
              <div className="trash-list">
                {removedTasks.map(task => (
                  <div key={task.id} className="trash-item">
                    <div className="trash-item-info">
                      <span className="trash-item-text">{task.text}</span>
                      <div className="trash-item-meta">
                        <span className="trash-item-category">
                          {getCategoryText(task.category)}
                        </span>
                        <span className="trash-item-date">
                          حذف شده: {task.removedAt}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="control-btn small-btn"
                      onClick={() => recoverTask(task.id)}
                    >
                      <FaUndo />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="card glass-card">
          <h3 className="card-heading">
            <FaPlus />
            کار جدید
          </h3>
          
          <div className="input-row">
            <input 
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="کار جدید را اینجا بنویسید..."
              className="form-field full-width-field"
            />
          </div>

          <div className="picker-row">
            <CategoryPicker 
              selectedValue={taskCategory} 
              onValueChange={setTaskCategory} 
            />
            <PriorityPicker 
              selectedValue={taskPriority} 
              onValueChange={setTaskPriority} 
            />
          </div>

          <div className="input-row">
            <PersianDatePicker 
              value={taskDueDate}
              onChange={setTaskDueDate}
              placeholder="انتخاب مهلت انجام (اختیاری)"
            />
            
            <input
              type="text"
              value={taskTags}
              onChange={(e) => setTaskTags(e.target.value)}
              placeholder="برچسب‌ها (با کاما جدا کنید)"
              className="form-field"
            />
            
            <button onClick={handleAddTask} className="main-btn add-task-btn">
              <FaPlus />
              افزودن کار
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="card glass-card">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در کارها..."
                className="form-field search-field"
              />
            </div>
            <div className="filter-buttons">
              {['all', 'completed', 'pending', 'urgent'].map(filterType => (
                <button
                  key={filterType}
                  className={`filter-button ${currentFilter === filterType ? 'active-filter' : ''}`}
                  onClick={() => setCurrentFilter(filterType)}
                >
                  {filterType === 'all' && 'همه'}
                  {filterType === 'completed' && 'انجام شده'}
                  {filterType === 'pending' && 'در انتظار'}
                  {filterType === 'urgent' && 'فوری'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-box glass-card">
            <div className="stat-icon-wrapper">
              <FaChartBar />
            </div>
            <span className="stat-number">{convertToPersianNumbers(taskStats.total)}</span>
            <span className="stat-label">کل کارها</span>
          </div>
          <div className="stat-box glass-card">
            <div className="stat-icon-wrapper">
              <FaCheck />
            </div>
            <span className="stat-number">{convertToPersianNumbers(taskStats.completed)}</span>
            <span className="stat-label">انجام شده</span>
          </div>
          <div className="stat-box glass-card">
            <div className="stat-icon-wrapper">
              <FaClock />
            </div>
            <span className="stat-number">{convertToPersianNumbers(taskStats.pending)}</span>
            <span className="stat-label">در انتظار</span>
          </div>
          <div className="stat-box glass-card">
            <div className="stat-icon-wrapper">
              <FaExclamationTriangle />
            </div>
            <span className="stat-number">{convertToPersianNumbers(taskStats.urgent)}</span>
            <span className="stat-label">فوری</span>
          </div>
        </div>

        <div className="tasks-section">
          <h3 className="section-heading">
            <FaList />
            کارهای شما ({convertToPersianNumbers(getFilteredTasks.length)})
          </h3>
          
          <div className="tasks-list">
            {getFilteredTasks.length === 0 ? (
              <div className="empty-state card">
                <FaRegFolder className="empty-icon" />
                <p>هیچ کاری یافت نشد</p>
                <small>کار جدیدی اضافه کنید</small>
              </div>
            ) : (
              getFilteredTasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'is-completed' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="task-checkbox"
                  />
                  
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    <div className="task-meta">
                      <span 
                        className="info-badge category-badge"
                        style={{ background: getCategoryColor(task.category) }}
                      >
                        {getCategoryText(task.category)}
                      </span>
                      
                      <span 
                        className="info-badge priority-badge"
                        style={{ background: getPriorityColor(task.priority) }}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                      
                      {task.tags.length > 0 && (
                        <div className="tags-wrapper">
                          <FaTags className="tags-icon" />
                          {task.tags.map((tag, index) => (
                            <span key={index} className="tag-item">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      {task.dueDate && (
                        <div className="due-date-info">
                          <span className="task-date">
                            <FaRegCalendar />
                            مهلت: {showDate(task.dueDate)}
                          </span>
                          <span 
                            className="remaining-days"
                            style={{ color: getRemainingColor(getDaysRemaining(task.dueDate)) }}
                          >
                            {getRemainingText(getDaysRemaining(task.dueDate))}
                          </span>
                        </div>
                      )}
                      
                      <span className="task-date">
                        <FaRegClock />
                        ایجاد: {showDate(task.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeTask(task.id)}
                    className="delete-task-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TaskManager;