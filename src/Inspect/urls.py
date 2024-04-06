from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    UserRegistrationView,
    LoginView,
    UserContactViewSet,
    CompanyListView,
    VCFDownloadView,
    UserSettingView,
    ForgotPasswordRequestView,
    ResetPasswordConfirmView,
    SuperAdminCreateUserView,
    UserDetailView, UserListView, ResetPasswordTokenValidateView, ExchangeView,
    # CompanyCRUDView,
    # CompanyCreateView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = DefaultRouter()
router.register(r"usercontacts", UserContactViewSet, basename="usercontacts")
router.register(r'exchange', ExchangeView)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    # path("companies/<int:pk>/", CompanyCRUDView.as_view(), name="company-crud"),
    # path("companies/add/", CompanyCreateView.as_view(), name="company-create"),
    path("companies/", CompanyListView.as_view(), name="company-list"),
    path(
        "superadmin/create_user/",
        SuperAdminCreateUserView.as_view(),
        name="superadmin-create-user",
    ),
    path("user/<int:user_id>/", UserDetailView.as_view(), name="user-detail"),
    path("user/", UserListView.as_view(), name="user_list"),
    path("contacts/<int:pk>/vcf/", VCFDownloadView.as_view(), name="vcf-download"),
    path("user/settings/", UserSettingView.as_view(), name="user-settings"),
    path(
        "forgot-password/", ForgotPasswordRequestView.as_view(), name="forgot-password"
    ),
    path(
        "reset-password/<uidb64>/<token>/",
        ResetPasswordConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "reset-password/validate_token/",
        ResetPasswordTokenValidateView.as_view(),
        name="password-reset-validate-token",
    ),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
