import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { BadgeCheck } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const theme = useThemeStore();
    const sections = [
      { id: "perfil", label: "Editar perfil" },
      { id: "seguridad", label: "Cambiar contraseña" },
      { id: "pago", label: "Métodos de pago" }
    ];
    const activeSection = ref("perfil");
    const form = reactive({ first_name: "", last_name: "", email: "", rut: "", address: "", phone: "", upload_avatar: "" });
    const avatarPreview = ref("");
    const passwordForm = reactive({ current_password: "", new_password: "" });
    const saving = ref(false);
    const changing = ref(false);
    const message = ref("");
    const messageType = ref("ok");
    const passwordMessage = ref("");
    const passwordStatus = ref("ok");
    const uploadingAvatar = ref(false);
    const uploadError = ref("");
    const sendingPasswordOtpCode = ref(false);
    const confirmingPasswordOtp = ref(false);
    const passwordOtpCode = ref("");
    const paymentMethods = ref([]);
    const savingPaymentMethod = ref(false);
    const paymentMethodMessage = ref("");
    const paymentMethodStatus = ref("ok");
    const sendingVerificationCode = ref(false);
    const confirmingVerificationCode = ref(false);
    const verificationCode = ref("");
    const verificationMessage = ref("");
    const verificationStatus = ref("ok");
    const isEmailVerified = ref(false);
    const emailVerifiedAt = ref("");
    const isGoogleVerified = ref(false);
    const googleVerifiedAt = ref("");
    const googleVerificationMessage = ref("");
    const googleVerificationStatus = ref("ok");
    ref(null);
    const sendingPhoneVerificationCode = ref(false);
    const confirmingPhoneVerificationCode = ref(false);
    const phoneVerificationCode = ref("");
    const phoneVerificationMessage = ref("");
    const phoneVerificationStatus = ref("ok");
    const isPhoneVerified = ref(false);
    const phoneVerifiedAt = ref("");
    const paymentForm = reactive({
      id: null,
      provider: "paypal",
      label: "",
      account_holder_name: "",
      account_email: "",
      card_brand: "",
      card_last4: "",
      is_default: true
    });
    const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: "#fff" }));
    const initials = computed(() => (auth.user?.username || "U").slice(0, 2).toUpperCase());
    const hasVerifiedBadge = computed(() => isEmailVerified.value || isPhoneVerified.value || isGoogleVerified.value);
    const verifiedAtLabel = computed(() => {
      if (!emailVerifiedAt.value) return "";
      try {
        return new Date(emailVerifiedAt.value).toLocaleString("es-CL", {
          dateStyle: "medium",
          timeStyle: "short"
        });
      } catch {
        return "";
      }
    });
    const phoneVerifiedAtLabel = computed(() => {
      if (!phoneVerifiedAt.value) return "";
      try {
        return new Date(phoneVerifiedAt.value).toLocaleString("es-CL", {
          dateStyle: "medium",
          timeStyle: "short"
        });
      } catch {
        return "";
      }
    });
    const googleVerifiedAtLabel = computed(() => {
      if (!googleVerifiedAt.value) return "";
      try {
        return new Date(googleVerifiedAt.value).toLocaleString("es-CL", {
          dateStyle: "medium",
          timeStyle: "short"
        });
      } catch {
        return "";
      }
    });
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 min-h-screen px-4 py-10" }, _attrs))}><div class="mx-auto flex max-w-3xl flex-col gap-8"><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Perfil</p><h1 class="text-2xl font-bold text-slate-900">Mi cuenta</h1><div class="mt-1 flex items-center gap-2 text-sm text-slate-600"><span>${ssrInterpolate(unref(auth).user?.username || "Perfil")}</span>`);
      if (hasVerifiedBadge.value) {
        _push(ssrRenderComponent(unref(BadgeCheck), {
          class: "h-5 w-5 text-emerald-600",
          "aria-label": "Verificado"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><button class="text-sm font-semibold text-red-600">Cerrar sesión</button></div><div class="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4"><!--[-->`);
      ssrRenderList(sections, (section) => {
        _push(`<button type="button" class="${ssrRenderClass([activeSection.value === section.id ? "border-b-2 text-slate-900" : "text-slate-600 hover:text-slate-900", "px-4 py-2 text-sm font-semibold transition"])}" style="${ssrRenderStyle(activeSection.value === section.id ? { borderBottomColor: unref(theme).accent } : {})}">${ssrInterpolate(section.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (activeSection.value === "perfil") {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="mt-6 flex items-center gap-4"><div class="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">`);
        if (avatarPreview.value) {
          _push(`<img${ssrRenderAttr("src", avatarPreview.value)} alt="Avatar" class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">${ssrInterpolate(initials.value)}</div>`);
        }
        _push(`</div><div class="flex-1"><label class="text-sm text-slate-600">Foto de perfil</label><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600"><label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition"><input type="file" accept="image/*" class="hidden"><span>${ssrInterpolate(uploadingAvatar.value ? "Subiendo..." : "Subir archivo")}</span></label><span class="text-slate-500">Solo desde tu computadora o celular</span></div>`);
        if (uploadError.value) {
          _push(`<p class="text-xs text-red-600 mt-1">${ssrInterpolate(uploadError.value)}</p>`);
        } else if (uploadingAvatar.value) {
          _push(`<p class="text-xs text-slate-500 mt-1">Procesando imagen...</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-xs text-slate-500 mt-1">La foto se guarda en tu perfil cuando presionas Guardar cambios.</p></div></div><div class="mt-6 grid gap-4 sm:grid-cols-2"><div class="space-y-2 sm:col-span-2"><label class="text-sm text-slate-600">Nombre de usuario</label><input${ssrRenderAttr("value", unref(auth).user?.username || "")} type="text" readonly class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"></div><div class="space-y-2"><label class="text-sm text-slate-600">Nombre</label><input${ssrRenderAttr("value", form.first_name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Apellido</label><input${ssrRenderAttr("value", form.last_name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 sm:col-span-2"><label class="text-sm text-slate-600">Email</label><input${ssrRenderAttr("value", form.email)} type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">RUT</label><input${ssrRenderAttr("value", form.rut)} type="text" placeholder="12.345.678-5" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Teléfono</label><input${ssrRenderAttr("value", form.phone)} type="text" placeholder="+56 9 ..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 sm:col-span-2"><label class="text-sm text-slate-600">Dirección</label><input${ssrRenderAttr("value", form.address)} type="text" placeholder="Calle, comuna, ciudad" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div><div class="mt-6 flex items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar cambios")}</button>`);
        if (message.value) {
          _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(message.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (!hasVerifiedBadge.value) {
          _push(`<div class="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-sm font-semibold text-slate-900">Verificar tu cuenta</p><p class="text-xs text-slate-600">Para mayor seguridad, verifica tu cuenta mediante correo o SMS.</p><div class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">Verificación por correo</p>`);
          if (isEmailVerified.value) {
            _push(`<p class="text-xs text-slate-600">Verificado ${ssrInterpolate(verifiedAtLabel.value)}</p>`);
          } else {
            _push(`<p class="text-xs text-slate-600">Recibe un código de verificación.</p>`);
          }
          _push(`</div><span class="${ssrRenderClass([isEmailVerified.value ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700", "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(isEmailVerified.value ? "Verificado" : "Pendiente")}</span></div>`);
          if (!isEmailVerified.value) {
            _push(`<div class="mt-3 flex flex-wrap items-center gap-2"><button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"${ssrIncludeBooleanAttr(sendingVerificationCode.value) ? " disabled" : ""}>${ssrInterpolate(sendingVerificationCode.value ? "Enviando..." : "Enviar código")}</button><input${ssrRenderAttr("value", verificationCode.value)} type="text" maxlength="6" placeholder="Código de 6 dígitos" class="w-44 rounded-lg border border-slate-200 px-3 py-2 text-sm"><button class="rounded-lg px-3 py-2 text-sm font-semibold text-white" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(confirmingVerificationCode.value || verificationCode.value.trim().length < 6) ? " disabled" : ""}>${ssrInterpolate(confirmingVerificationCode.value ? "Verificando..." : "Confirmar")}</button>`);
            if (verificationMessage.value) {
              _push(`<p class="${ssrRenderClass([verificationStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(verificationMessage.value)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">Verificación con Google</p>`);
          if (isGoogleVerified.value) {
            _push(`<p class="text-xs text-slate-600">Verificado ${ssrInterpolate(googleVerifiedAtLabel.value)}</p>`);
          } else {
            _push(`<p class="text-xs text-slate-600">Vincula tu cuenta de Google.</p>`);
          }
          _push(`</div><span class="${ssrRenderClass([isGoogleVerified.value ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700", "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(isGoogleVerified.value ? "Verificado" : "Pendiente")}</span></div>`);
          if (!isGoogleVerified.value) {
            _push(`<div class="mt-3"><div class="min-h-[40px]"></div>`);
            if (googleVerificationMessage.value) {
              _push(`<p class="${ssrRenderClass([googleVerificationStatus.value === "error" ? "text-red-600" : "text-emerald-600", "mt-2 text-sm"])}">${ssrInterpolate(googleVerificationMessage.value)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">Verificación por SMS</p>`);
          if (isPhoneVerified.value) {
            _push(`<p class="text-xs text-slate-600">Verificado ${ssrInterpolate(phoneVerifiedAtLabel.value)}</p>`);
          } else {
            _push(`<p class="text-xs text-slate-600">Recibe un código por SMS.</p>`);
          }
          _push(`</div><span class="${ssrRenderClass([isPhoneVerified.value ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700", "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(isPhoneVerified.value ? "Verificado" : "Pendiente")}</span></div>`);
          if (!isPhoneVerified.value) {
            _push(`<div class="mt-3 flex flex-wrap items-center gap-2"><button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"${ssrIncludeBooleanAttr(sendingPhoneVerificationCode.value) ? " disabled" : ""}>${ssrInterpolate(sendingPhoneVerificationCode.value ? "Enviando..." : "Enviar código SMS")}</button><input${ssrRenderAttr("value", phoneVerificationCode.value)} type="text" maxlength="6" placeholder="Código SMS de 6 dígitos" class="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm"><button class="rounded-lg px-3 py-2 text-sm font-semibold text-white" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(confirmingPhoneVerificationCode.value || phoneVerificationCode.value.trim().length < 6) ? " disabled" : ""}>${ssrInterpolate(confirmingPhoneVerificationCode.value ? "Verificando..." : "Confirmar SMS")}</button>`);
            if (phoneVerificationMessage.value) {
              _push(`<p class="${ssrRenderClass([phoneVerificationStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(phoneVerificationMessage.value)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeSection.value === "seguridad") {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Seguridad</p><h2 class="text-xl font-semibold text-slate-900">Cambiar contraseña</h2><p class="mt-2 text-sm text-slate-600">Solicita un código al correo y confirma con tu contraseña actual.</p><div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">Cambio de contraseña con OTP</p><p class="text-xs text-slate-600">Proceso seguro de verificación en dos pasos.</p></div><button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"${ssrIncludeBooleanAttr(sendingPasswordOtpCode.value) ? " disabled" : ""}>${ssrInterpolate(sendingPasswordOtpCode.value ? "Enviando..." : "Enviar código OTP")}</button></div><div class="mt-4 grid gap-3 md:grid-cols-3"><div class="space-y-2"><label class="text-sm text-slate-600">Contraseña actual</label><input${ssrRenderAttr("value", passwordForm.current_password)} type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Nueva contraseña</label><input${ssrRenderAttr("value", passwordForm.new_password)} type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Código OTP</label><input${ssrRenderAttr("value", passwordOtpCode.value)} type="text" maxlength="6" placeholder="000000" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div><div class="mt-4 flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(changing.value || confirmingPasswordOtp.value || passwordOtpCode.value.trim().length < 6) ? " disabled" : ""}>${ssrInterpolate(confirmingPasswordOtp.value ? "Verificando..." : "Confirmar y cambiar contraseña")}</button>`);
        if (passwordMessage.value) {
          _push(`<p class="${ssrRenderClass([passwordStatus.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(passwordMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeSection.value === "pago") {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pagos</p><h2 class="text-xl font-semibold text-slate-900">Mis métodos de pago</h2><p class="mt-1 text-sm text-slate-600">Úsalos para autocompletar checkout y como cuenta receptora en tus tiendas.</p><div class="mt-4 grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Tipo</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="paypal"${ssrIncludeBooleanAttr(Array.isArray(paymentForm.provider) ? ssrLooseContain(paymentForm.provider, "paypal") : ssrLooseEqual(paymentForm.provider, "paypal")) ? " selected" : ""}>PayPal</option><option value="card"${ssrIncludeBooleanAttr(Array.isArray(paymentForm.provider) ? ssrLooseContain(paymentForm.provider, "card") : ssrLooseEqual(paymentForm.provider, "card")) ? " selected" : ""}>Tarjeta</option></select></div><div class="space-y-2"><label class="text-sm text-slate-600">Etiqueta</label><input${ssrRenderAttr("value", paymentForm.label)} type="text" placeholder="Ej: PayPal negocio" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Titular</label><input${ssrRenderAttr("value", paymentForm.account_holder_name)} type="text" placeholder="Nombre titular" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div>`);
        if (paymentForm.provider === "paypal") {
          _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Correo PayPal</label><input${ssrRenderAttr("value", paymentForm.account_email)} type="email" placeholder="cobros@correo.com" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div>`);
        } else {
          _push(`<!--[--><div class="space-y-2"><label class="text-sm text-slate-600">Marca tarjeta</label><input${ssrRenderAttr("value", paymentForm.card_brand)} type="text" placeholder="Visa / Mastercard" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Últimos 4 dígitos</label><input${ssrRenderAttr("value", paymentForm.card_last4)} type="text" maxlength="4" placeholder="1234" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><!--]-->`);
        }
        _push(`<div class="space-y-2 md:col-span-2"><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(paymentForm.is_default) ? ssrLooseContain(paymentForm.is_default, null) : paymentForm.is_default) ? " checked" : ""} type="checkbox" class="h-4 w-4"> Usar como método predeterminado </label></div></div><div class="mt-4 flex items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(savingPaymentMethod.value) ? " disabled" : ""}>${ssrInterpolate(savingPaymentMethod.value ? "Guardando..." : paymentForm.id ? "Actualizar método" : "Agregar método")}</button>`);
        if (paymentForm.id) {
          _push(`<button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancelar edición</button>`);
        } else {
          _push(`<!---->`);
        }
        if (paymentMethodMessage.value) {
          _push(`<p class="${ssrRenderClass([paymentMethodStatus.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(paymentMethodMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-5 space-y-2"><!--[-->`);
        ssrRenderList(paymentMethods.value, (method) => {
          _push(`<article class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"><div class="flex flex-wrap items-center justify-between gap-2"><div><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(method.label)} `);
          if (method.is_default) {
            _push(`<span class="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Predeterminado</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><p class="text-xs text-slate-600">`);
          if (method.provider === "paypal") {
            _push(`<!--[-->PayPal · ${ssrInterpolate(method.account_email)}<!--]-->`);
          } else {
            _push(`<!--[-->Tarjeta ${ssrInterpolate(method.card_brand || "—")} · **** ${ssrInterpolate(method.card_last4 || "—")}<!--]-->`);
          }
          _push(`</p></div><div class="flex items-center gap-2"><button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Editar</button><button class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Eliminar</button></div></div></article>`);
        });
        _push(`<!--]-->`);
        if (!paymentMethods.value.length) {
          _push(`<p class="text-sm text-slate-500">Aún no tienes métodos de pago guardados.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-CDvM1sfl.mjs.map
