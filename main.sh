#!/bin/bash

# Define function to display main menu
display_menu() {
    echo "Select an option:"
    echo "1. Create a new C program"
    echo "2. Build and run selected program"
    echo "3. Exit"
}

# Define function to create a new C program
create_c_program() {
    # Prompt user to select a template
    echo "Select a template:"
    echo "1. Basic C program"
    echo "2. Another template (add more if needed)"
    echo "3. Back to main menu"

    read -p "Enter your choice: " choice

    # Define the template files
    basic_template="templates/basic.c"
    another_template="template/io.c"

    # Define the filename for the new C program
    read -p "Enter the filename for your C program (without extension): " filename

    case $choice in
        1) template_file=$basic_template ;;
        2) template_file=$another_template ;;
        3) return ;;
        *) echo "Invalid choice. Please try again."; return ;;
    esac

    # Check if the selected template exists
    if [ ! -f $template_file ]; then
        echo "Template file not found. Exiting."
        exit 1
    fi

    # Create a new C program file from the selected template
    cp $template_file "$filename.c"

    # Open the new C program file in Vim
    vim "$filename.c"
}

# Define function to build and run selected program
build_and_run_program() {
    read -p "Enter the filename of the program you want to build and run (without extension): " program_name

    # Check if the source file exists
    if [ ! -f "$program_name.c" ]; then
        echo "Source file '$program_name.c' not found."
        return
    fi

    # Compile the program
    gcc "$program_name.c" -o "$program_name"

    # Check if compilation was successful
    if [ $? -eq 0 ]; then
        # Run the program
        "./$program_name"
    else
        echo "Compilation failed."
    fi
}

# Main loop
while true; do
    display_menu
    read -p "Enter your choice: " main_choice

    case $main_choice in
        1) create_c_program ;;
        2) build_and_run_program ;;
        3) echo "Exiting."; exit ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done
