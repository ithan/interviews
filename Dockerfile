FROM node:22 AS builder

# Set the working directory for the application
WORKDIR /directus

# --- Project Files Copy ---
# Copy all project files, including the submodule folders, .gitmodules, and extensions/
# We only need to copy what's essential for the build and the final image.
COPY extensions/ extensions/
COPY .gitmodules .gitmodules


# --- Directus Image ---
FROM directus/directus:11.13.4 AS directus

# Copy only the compiled/installed extensions from the builder stage
# The extensions are what Directus needs to run.
COPY --from=builder --chown=node:node /directus/extensions /directus/extensions