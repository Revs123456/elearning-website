# Testing Guide for Frustrated Thinkers

## 🧪 How to Test the Website

### Step 1: Access the Website
1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the home page with "Frustrated Thinkers" header

### Step 2: Test Authentication

#### Create Account
1. Click **"Create Account"** button in top right
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click **"Create Account"**
4. You should be logged in and see your name in the header

#### Sign Out and Sign In
1. Click **"Logout"** button
2. Click **"Sign In"** button
3. Enter:
   - Email: test@example.com
   - Password: test123
4. Click **"Sign In"**
5. You should be logged in again

### Step 3: Test Course Access

#### Without Login
1. Log out if logged in
2. Click on **"SQL Course"** or **"JavaScript Course"** card
3. You should see an alert asking you to sign in

#### With Login
1. Sign in with your account
2. Click on **"SQL Course"** card
3. You should see the course detail page with all 30 modules

### Step 4: Test Module Learning

#### First Module (Always Unlocked)
1. Click on **"Module 1: Introduction to Databases"**
2. The module should expand showing:
   - Content text
   - Code example
   - "Take Quiz" button
3. Read the content

#### Take a Quiz
1. Click **"Take Quiz"** button
2. Answer the 5 questions:
   - Question 1 (MCQ): Select "Structured Query Language"
   - Question 2 (MCQ): Select "MySQL"
   - Question 3 (Fill): Type "tables"
   - Question 4 (MCQ): Select "Relational"
   - Question 5 (MCQ): Select "All of the above"
3. Click **"Submit Quiz"**
4. You should see results showing:
   - 5/5 correct
   - 100% score
   - "Congratulations!" message
5. Close the quiz modal
6. Module 1 should now show ✅ icon

#### Sequential Unlocking
1. Try to click **Module 3** (should be locked 🔒)
2. You should see: "Please complete previous modules first"
3. Click **Module 2** (should be unlocked now)
4. Complete Module 2's quiz
5. Now Module 3 should unlock

### Step 5: Test Dashboard

#### View Progress
1. Click **"Dashboard"** in left sidebar
2. You should see:
   - Total modules completed
   - Overall progress percentage
   - SQL course progress bar
   - JavaScript course progress bar
   - Statistics cards

#### Courses Enrolled
1. Click **"Courses Enrolled"** in sidebar
2. You should see both courses listed
3. Click **"Continue"** button to resume a course

#### Courses Completed
1. Click **"Courses Completed"** in sidebar
2. You should see list of completed modules
3. Each module shows ✅ and course name

### Step 6: Test Profile
1. Click **"Profile"** in sidebar
2. You should see:
   - Your avatar (first letter of name)
   - Full name
   - Email address
   - Statistics

### Step 7: Test JavaScript Course
1. Go back to **Home**
2. Click **"JavaScript Course"** card
3. Complete Module 1
4. Verify sequential unlocking works
5. Check dashboard shows JS progress

### Step 8: Test Footer
1. Scroll to bottom of any page
2. Click **Instagram icon** link
3. Should open: https://instagram.com/techchamps_by.rev

### Step 9: Test Responsive Design
1. Resize browser window to mobile size
2. Check that:
   - Sidebar collapses
   - Hamburger menu appears
   - Content is readable
   - Buttons are clickable

### Step 10: Test Edge Cases

#### Password Validation
1. Try creating account with password < 6 characters
2. Should show error: "Password must be at least 6 characters"

#### Password Mismatch
1. Try creating account with different passwords
2. Should show error: "Passwords do not match"

#### Duplicate Email
1. Try creating account with existing email
2. Should show error: "Email already registered"

#### Wrong Password
1. Try signing in with wrong password
2. Should show error: "Invalid credentials"

## ✅ Expected Results

### All Features Should Work:
- ✅ Authentication (sign up, sign in, logout)
- ✅ Course access control
- ✅ Module expansion/collapse
- ✅ Sequential module unlocking
- ✅ Quiz taking and grading
- ✅ Progress tracking
- ✅ Dashboard statistics
- ✅ Profile display
- ✅ Responsive design
- ✅ Instagram link

### No Errors Should Appear:
- ✅ No console errors
- ✅ No broken images
- ✅ No missing styles
- ✅ All buttons clickable
- ✅ All forms submittable

## 🐛 If You Find Bugs

1. Note the exact steps to reproduce
2. Check browser console for errors (F12)
3. Take a screenshot if needed
4. Report the issue

## 🎉 Success Criteria

The website is working correctly if:
1. You can create an account and sign in
2. You can access courses only when logged in
3. Modules unlock sequentially
4. Quizzes work and grade correctly
5. Progress is tracked accurately
6. Dashboard shows correct statistics
7. All navigation works smoothly
8. UI is attractive and responsive

---

**Happy Testing! 🚀**
