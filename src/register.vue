<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth } from "@/firebase/config";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const massegeEmail = ref("");
const massegePassword = ref("");
const massegeConfirmPassword = ref("");

// دالة التحقق من صيغة الإيميل
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).toLowerCase());
};

// دالة التحقق من وجود حروف وأرقام في الباسورد
const validatePasswordStrength = (pass) => {
  // التعبير ده بيتأكد إن فيه حرف واحد ورقم واحد على الأقل
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(pass);
};

async function register() {
  // 1. تصفير الرسائل عند كل ضغطة
  massegeEmail.value = "";
  massegePassword.value = "";
  massegeConfirmPassword.value = "";

  let valid = true;

  // 2. التحقق من الإيميل
  if (!email.value) {
    massegeEmail.value = "please enter email";
    valid = false;
  } else if (!validateEmail(email.value)) {
    massegeEmail.value = "Invalid email format";
    valid = false;
  }

  // 3. التحقق من الباسورد (طول + قوة)
  if (!password.value) {
    massegePassword.value = "please enter password";
    valid = false;
  } else if (password.value.length < 8) {
    massegePassword.value = "password must be at least 8 characters";
    valid = false;
  } else if (!validatePasswordStrength(password.value)) {
    massegePassword.value = "password must contain both letters and numbers";
    valid = false;
  }

  // 4. التأكد من تطابق الباسورد
  if (!confirmPassword.value) {
    massegeConfirmPassword.value = "please confirm password";
    valid = false;
  } else if (confirmPassword.value !== password.value) {
    massegeConfirmPassword.value = "passwords do not match";
    valid = false;
  }

  // لو فيه أي خطأ في الإدخال بنوقف هنا
  if (!valid) return;

  try {
    // 5. محاولة التسجيل في فايربيس
    await createUserWithEmailAndPassword(auth, email.value, password.value);

    // لو نجح بنوديه لصفحة الهوم
    router.push({ name: "home" });
  } catch (error) {
    // 6. التعامل مع أخطاء السيرفر (Firebase Errors)
    console.error("Firebase Error:", error.code);

    if (error.code === "auth/email-already-in-use") {
      massegeEmail.value = "This email is already registered";
    } else if (error.code === "auth/network-request-failed") {
      massegeEmail.value = "Check your internet connection";
    } else {
      massegeEmail.value = "An error occurred. Please try again later";
    }
  }
}
</script>

<template>
  <div class="register-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 col-sm-10">
          <div class="glass-card">
            <h2 class="text-center form-title">Create Account</h2>

            <form @submit.prevent="register">
              <div class="form-group mb-3 text-start">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control custom-input"
                  placeholder="name@example.com"
                />
                <small class="text-danger" v-if="massegeEmail">
                  {{ massegeEmail }}
                </small>
              </div>

              <div class="form-group mb-3 text-start">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control custom-input"
                  placeholder="••••••••"
                />
                <small class="text-danger" v-if="massegePassword">
                  {{ massegePassword }}
                </small>
              </div>

              <div class="form-group mb-4 text-start">
                <label class="form-label">Confirm Password</label>
                <input
                  type="password"
                  v-model="confirmPassword"
                  class="form-control custom-input"
                  placeholder="••••••••"
                />
                <small class="text-danger" v-if="massegeConfirmPassword">
                  {{ massegeConfirmPassword }}
                </small>
              </div>

              <button type="submit" class="btn-register w-100">Register Now</button>
            </form>

            <p class="text-center mt-4 text-white-50 small">
              Already have an account?
              <router-link to="/" class="login-link">Login</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-wrapper {
  font-family: "Segoe UI", sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #00c6ff, #0072ff, #00c6ff, #0072ff);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding: 20px;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  padding: 40px;
  clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
  transition: transform 0.3s ease;
}

.form-title {
  color: #ffffff;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  margin-bottom: 8px;
  margin-left: 5px;
}

.custom-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 15px;
  color: white !important;
}

.custom-input:focus {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  outline: none;
}

.btn-register {
  background: #ffffff;
  color: #0072ff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.2);
  background: #f8f9fa;
}

.login-link {
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid white;
}

.text-danger {
  color: #ffb3b3 !important;
  font-size: 0.75rem;
  margin-top: 5px;
  font-weight: 600;
}
</style>
