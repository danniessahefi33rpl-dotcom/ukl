import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Initialize controllers
const authController = new AuthController();
const userController = new UserController();
const attendanceController = new AttendanceController();

// ==================== Auth Routes ====================
/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/auth/login', (req, res) => authController.login(req, res));

// ==================== User Routes ====================
/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/users', authenticate, authorize('admin'), (req, res) => 
  userController.createUser(req, res)
);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/users', authenticate, authorize('admin'), (req, res) => 
  userController.getAllUsers(req, res)
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/users/:id', authenticate, (req, res) => 
  userController.getUserById(req, res)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/users/:id', authenticate, authorize('admin'), (req, res) => 
  userController.updateUser(req, res)
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/users/:id', authenticate, authorize('admin'), (req, res) => 
  userController.deleteUser(req, res)
);

// ==================== Attendance Routes ====================
/**
 * @route   POST /api/attendance
 * @desc    Create attendance record
 * @access  Private
 */
router.post('/attendance', authenticate, (req, res) => 
  attendanceController.createAttendance(req, res)
);

/**
 * @route   PUT /api/attendance/:id
 * @desc    Update attendance record (for check out)
 * @access  Private
 */
router.put('/attendance/:id', authenticate, (req, res) => 
  attendanceController.updateAttendance(req, res)
);

/**
 * @route   GET /api/attendance/:id
 * @desc    Get attendance by ID
 * @access  Private
 */
router.get('/attendance/:id', authenticate, (req, res) => 
  attendanceController.getAttendanceById(req, res)
);

/**
 * @route   GET /api/attendance/history/:user_id
 * @desc    Get attendance history for a user
 * @access  Private
 * @query   start_date, end_date (optional)
 */
router.get('/attendance/history/:user_id', authenticate, (req, res) => 
  attendanceController.getAttendanceHistory(req, res)
);

/**
 * @route   GET /api/attendance/summary/:user_id
 * @desc    Get monthly attendance summary
 * @access  Private
 * @query   month (1-12), year (required)
 */
router.get('/attendance/summary/:user_id', authenticate, (req, res) => 
  attendanceController.getMonthlySummary(req, res)
);

/**
 * @route   POST /api/attendance/analysis
 * @desc    Analyze attendance based on filters
 * @access  Private (Admin only)
 */
router.post('/attendance/analysis', authenticate, authorize('admin'), (req, res) => 
  attendanceController.getAttendanceAnalysis(req, res)
);

export default router;