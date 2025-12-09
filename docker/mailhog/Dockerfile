# MailHog with non-root user for security hardening
FROM mailhog/mailhog:latest

# The base image already has a 'mailhog' user/group
# Just switch to it for non-root execution
USER mailhog

# Expose SMTP and HTTP ports
EXPOSE 1025 8025

# Default command (inherited from base image, but explicit for clarity)
ENTRYPOINT ["MailHog"]

