import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';

const normalizeRut = (value) => {
  const raw = String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();
  if (raw.length < 2) return "";
  return `${raw.slice(0, -1)}${raw.slice(-1)}`;
};
const calculateDv = (body) => {
  let factor = 2;
  let total = 0;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    total += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - total % 11;
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
};
const isValidRut = (value) => {
  const normalized = normalizeRut(value);
  if (normalized.length < 2) return false;
  const body = normalized.slice(0, -1);
  const dv = normalized.slice(-1);
  if (!/^\d{7,8}$/.test(body)) return false;
  return calculateDv(body) === dv;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
    const loading = ref(false);
    const form = reactive({
      username: "",
      email: "",
      rut: "",
      address: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      first_name: "",
      last_name: ""
    });
    const validation = computed(() => {
      const issues = {
        username: null,
        email: null,
        rut: null,
        address: null,
        phone: null,
        password: null,
        passwordConfirm: null
      };
      const username = form.username.trim();
      const email = form.email.trim();
      const rut = form.rut.trim();
      const address = form.address.trim();
      const phone = form.phone.trim();
      const password = form.password;
      const passwordConfirm = form.passwordConfirm;
      if (username.length < 3) issues.username = "Mínimo 3 caracteres.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) issues.email = "Ingresa un email válido.";
      if (!isValidRut(rut)) issues.rut = "Ingresa un RUT válido (ej: 12.345.678-5).";
      if (address.length < 5) issues.address = "Ingresa una dirección válida.";
      if (phone.length < 8) issues.phone = "Ingresa un teléfono válido.";
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) issues.password = "Debe incluir letras, números y al menos 8 caracteres.";
      if (password && passwordConfirm && password !== passwordConfirm) issues.passwordConfirm = "Las contraseñas no coinciden.";
      return issues;
    });
    const firstError = computed(() => Object.values(validation.value).find(Boolean) || null);
    const canSubmit = computed(() => !loading.value && !auth.loading && !firstError.value);
    const strength = computed(() => {
      const value = form.password;
      if (!value) return "empty";
      const long = value.length >= 10;
      const hasUpper = /[A-Z]/.test(value);
      const hasSymbol = /[^A-Za-z0-9]/.test(value);
      return long && hasUpper && hasSymbol ? "strong" : "ok";
    });
    const passwordLabel = computed(() => {
      if (strength.value === "strong") return "Fuerte";
      if (strength.value === "ok") return "Aceptable";
      return "Pendiente";
    });
    const passwordStrengthClass = computed(() => {
      if (strength.value === "strong") return "text-emerald-300";
      if (strength.value === "ok") return "text-amber-200";
      return "text-white/50";
    });
    const inputClass = (field) => [
      "w-full rounded-xl border bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60",
      validation.value[field] ? "border-red-400/60 focus:border-red-300" : "border-white/20"
    ];
    watch(
      () => [form.username, form.email, form.rut, form.address, form.phone, form.password, form.passwordConfirm],
      () => {
        if (auth.error) auth.error = null;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen bg-slate-950 text-white" }, _attrs))}><div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-24 top-10 h-80 w-80 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70"></div><div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60"></div></div><div class="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16"><div class="hidden flex-1 lg:block"><div class="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur"><p class="text-sm uppercase tracking-[0.2em] text-white/70">Pymeweb</p><h1 class="mt-4 text-4xl font-extrabold leading-tight">Crea tu cuenta</h1><p class="mt-3 text-lg text-white/70">Regístrate para gestionar tu tienda y publicar en el marketplace.</p></div></div><div class="flex-1"><div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"><p class="text-sm uppercase tracking-[0.2em] text-white/70">Registro</p><h2 class="mt-3 text-2xl font-bold">Crea tu cuenta</h2><p class="text-white/60">Completa tus datos para iniciar sesión de inmediato.</p><form class="mt-6 space-y-4"><div class="grid gap-4 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm text-white/80">Nombre</label><input${ssrRenderAttr("value", form.first_name)} type="text" autocomplete="given-name" class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" inputmode="text"></div><div class="space-y-2"><label class="text-sm text-white/80">Apellido</label><input${ssrRenderAttr("value", form.last_name)} type="text" autocomplete="family-name" class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" inputmode="text"></div></div><div class="space-y-2"><label class="text-sm text-white/80">Usuario</label><input${ssrRenderAttr("value", form.username)} class="${ssrRenderClass(inputClass("username"))}" type="text" required autocomplete="username" minlength="3" inputmode="text"${ssrRenderAttr("aria-invalid", Boolean(validation.value.username))}>`);
      if (validation.value.username) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.username)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">Email</label><input${ssrRenderAttr("value", form.email)} class="${ssrRenderClass(inputClass("email"))}" type="email" required autocomplete="email" inputmode="email"${ssrRenderAttr("aria-invalid", Boolean(validation.value.email))}>`);
      if (validation.value.email) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">RUT</label><input${ssrRenderAttr("value", form.rut)} class="${ssrRenderClass(inputClass("rut"))}" type="text" required autocomplete="off" inputmode="text" placeholder="12.345.678-5"${ssrRenderAttr("aria-invalid", Boolean(validation.value.rut))}>`);
      if (validation.value.rut) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.rut)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">Dirección</label><input${ssrRenderAttr("value", form.address)} class="${ssrRenderClass(inputClass("address"))}" type="text" required autocomplete="street-address" inputmode="text"${ssrRenderAttr("aria-invalid", Boolean(validation.value.address))}>`);
      if (validation.value.address) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.address)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">Teléfono</label><input${ssrRenderAttr("value", form.phone)} class="${ssrRenderClass(inputClass("phone"))}" type="tel" required autocomplete="tel" inputmode="tel" placeholder="+56 9 1234 5678"${ssrRenderAttr("aria-invalid", Boolean(validation.value.phone))}>`);
      if (validation.value.phone) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.phone)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">Contraseña</label><input${ssrRenderAttr("value", form.password)} class="${ssrRenderClass(inputClass("password"))}" type="password" required autocomplete="new-password" minlength="8" pattern="(?=.*[A-Za-z])(?=.*\\d).{8,}"${ssrRenderAttr("aria-invalid", Boolean(validation.value.password))}><div class="flex items-center justify-between text-xs text-white/60"><span>Mínimo 8 caracteres, letras y números.</span><span class="${ssrRenderClass(passwordStrengthClass.value)}">${ssrInterpolate(passwordLabel.value)}</span></div>`);
      if (validation.value.password) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm text-white/80">Confirmar contraseña</label><input${ssrRenderAttr("value", form.passwordConfirm)} class="${ssrRenderClass(inputClass("passwordConfirm"))}" type="password" required autocomplete="new-password"${ssrRenderAttr("aria-invalid", Boolean(validation.value.passwordConfirm))}>`);
      if (validation.value.passwordConfirm) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(validation.value.passwordConfirm)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(auth).error) {
        _push(`<div class="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100">${ssrInterpolate(unref(auth).error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" style="${ssrRenderStyle({ background: `linear-gradient(90deg, ${unref(theme).accent}, ${unref(theme).gradientTo})` })}"${ssrIncludeBooleanAttr(!canSubmit.value) ? " disabled" : ""}>`);
      if (!loading.value) {
        _push(`<span>Registrarme</span>`);
      } else {
        _push(`<span class="flex items-center gap-2"><span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> Creando cuenta... </span>`);
      }
      _push(`</button><p class="text-xs text-white/60">Ya tienes cuenta? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Inicia sesión`);
          } else {
            return [
              createTextVNode("Inicia sesión")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-3XGUzWDk.mjs.map
