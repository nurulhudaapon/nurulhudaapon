#!/bin/bash

# Destination directory where the script will be copied (User's bin directory)
destination="$HOME/bin"

# Create bin directory if it doesn't exist
mkdir -p "$destination"

# Copy the script file to the destination directory
cp codeshell "$destination"

# Change permissions to make it executable
chmod +x "$destination/codeshell"

# Function to update PATH in shell configuration file
update_path() {
    local config_file="$1"
    local shell_type="$2"

    if [[ ! -f "$config_file" ]]; then
        echo "$config_file not found. Skipping PATH update for $shell_type."
        return
    fi

    if grep -q "$destination" "$config_file"; then
        echo "PATH already updated in $config_file for $shell_type."
    else
        echo "Updating PATH in $config_file for $shell_type."
        echo 'export PATH="$HOME/bin:$PATH"' >> "$config_file"
    fi
}

# Update PATH for bash
update_path "$HOME/.bashrc" "bash"
update_path "$HOME/.bash_profile" "bash"

# Update PATH for zsh if it exists
if [[ -f "$HOME/.zshrc" ]]; then
    update_path "$HOME/.zshrc" "zsh"
fi

# Source the configuration files to apply changes
source "$HOME/.bashrc" 2>/dev/null
source "$HOME/.bash_profile" 2>/dev/null
source "$HOME/.zshrc" 2>/dev/null

echo "CodeShell installed successfully and PATH updated."
