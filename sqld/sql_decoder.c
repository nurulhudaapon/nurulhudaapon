#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

// Function prototypes
void parseSQL(char *sql);
char* getTableName(char *sql, char *keyword);
void getSelectedColumns(char *sql);
void getJoinedTables(char *sql);
void getFilterConditions(char *sql);
void getOrderingConditions(char *sql);
void printFormattedSQL(char *sql);
void printRawSQL(char *sql);
void showMenu();
void clearScreen();
void readSQLFromFile(char *sql);
char* strcasestr(const char* str, const char* src);

int main() {
    char sql[1024] = "";
    int choice;

    while (1) {
        clearScreen();
        showMenu();
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                printf("Enter an SQL query: ");
                fgets(sql, sizeof(sql), stdin);

                size_t len = strlen(sql);
                if (len > 0 && sql[len - 1] == '\n') {
                    sql[len - 1] = '\0';
                }
                break;
            case 2:
                parseSQL(sql);
                printf("Press Enter to continue...");
                getchar();
                break;
            case 3:
                printRawSQL(sql);
                printf("Press Enter to continue...");
                getchar();
                break;
            case 4:
                printFormattedSQL(sql);
                printf("Press Enter to continue...");
                getchar();
                break;
            case 5:
                readSQLFromFile(sql);
                printf("Press Enter to continue...");
                getchar();
                break;
            case 6:
                printf("Exiting...\n");
                exit(0);
            default:
                printf("Invalid choice. Please try again.\n");
                printf("Press Enter to continue...");
                getchar();
        }
    }

    return 0;
}

void showMenu() {
    printf("\033[1;31m"
           "  ____   ___  _       ____                     _           \n"
           " / ___| / _ \\| |     |  _ \\  ___  ___ ___   __| | ___ _ __ \n"
           " \\___ \\| | | | |     | | | |/ _ \\/ __/ _ \\ / _` |/ _ \\ '__|\n"
           "  ___) | |_| | |___  | |_| |  __/ (_| (_) | (_| |  __/ |   \n"
           " |____/ \\__\\_\\_____| |____/ \\___|\\___\\___/ \\__,_|\\___|_|   \n"
           "                                                           \n"
           "\033[0m");

    printf("\033[1;34mMenu\033[0m\n");
    printf("1. Enter SQL Query\n");
    printf("2. Parse SQL Query\n");
    printf("3. Show Raw SQL\n");
    printf("4. Show Formatted SQL\n");
    printf("5. Read SQL from File\n");
    printf("6. Exit\n");
}

void clearScreen() {
    // ANSI escape code to clear screen
    printf("\033[H\033[J");
}

void parseSQL(char *sql) {
    if (strlen(sql) == 0) {
        printf("No SQL query entered.\n");
        return;
    }

    printf("\n\033[1;33mParsing SQL query...\033[0m\n");

    // Get the primary table name
    char *tableName = getTableName(sql, "from");
    if (tableName != NULL) {
        printf("\033[1;32m• Primary Table: \033[0m%s\n", tableName);
        free(tableName);
    } else {
        printf("\033[1;32m• Primary Table: \033[0mNot found\n");
    }

    // Get the selected columns
    getSelectedColumns(sql);

    // Get the joined tables
    getJoinedTables(sql);

    // Get filter conditions
    getFilterConditions(sql);

    // Get ordering conditions
    getOrderingConditions(sql);
}

char* getTableName(char *sql, char *keyword) {
    char *ptr = strcasestr(sql, keyword);
    if (ptr != NULL) {
        ptr += strlen(keyword);
        while (*ptr == ' ') ptr++;
        char *end = ptr;
        while (*end != ' ' && *end != '\0') end++;
        char *tableName = (char *)malloc(end - ptr + 1);
        strncpy(tableName, ptr, end - ptr);
        tableName[end - ptr] = '\0';
        return tableName;
    }
    return NULL;
}

void getSelectedColumns(char *sql) {
    char *ptr = strcasestr(sql, "select");
    if (ptr != NULL) {
        ptr += 6;
        while (*ptr == ' ') ptr++;
        char *end = strcasestr(ptr, "from");
        if (end != NULL) {
            char columns[256];
            strncpy(columns, ptr, end - ptr);
            columns[end - ptr] = '\0';
            printf("\033[1;36m• Selected Columns: \033[0m%s\n", columns);
        }
    } else {
        printf("\033[1;36m• Selected Columns: \033[0mNot found\n");
    }
}

void getJoinedTables(char *sql) {
    char *ptr = sql;
    printf("\033[1;34m• Joined Tables: \033[0m");
    int found = 0;
    while ((ptr = strcasestr(ptr, "join")) != NULL) {
        ptr += 4;
        while (*ptr == ' ') ptr++;
        char *end = ptr;
        while (*end != ' ' && *end != '\0') end++;
        char tableName[256];
        strncpy(tableName, ptr, end - ptr);
        tableName[end - ptr] = '\0';
        if (found) {
            printf(", ");
        }
        printf("%s", tableName);
        found = 1;
    }
    if (!found) {
        printf("None");
    }
    printf("\n");
}

void getFilterConditions(char *sql) {
    char *ptr = strcasestr(sql, "where");
    if (ptr != NULL) {
        ptr += 5;
        while (*ptr == ' ') ptr++;
        char *end = strcasestr(ptr, "group by");
        if (end == NULL) {
            end = strcasestr(ptr, "order by");
        }
        if (end != NULL) {
            char conditions[256];
            strncpy(conditions, ptr, end - ptr);
            conditions[end - ptr] = '\0';
            printf("\033[1;34m• Filter Conditions: \033[0m%s\n", conditions);
        } else {
            printf("\033[1;34m• Filter Conditions: \033[0m%s\n", ptr);
        }
    } else {
        printf("\033[1;34m• Filter Conditions: \033[0mNot found\n");
    }
}

void getOrderingConditions(char *sql) {
    char *ptr = strcasestr(sql, "order by");
    if (ptr != NULL) {
        ptr += 8;
        while (*ptr == ' ') ptr++;
        printf("\033[1;31m• Ordering Conditions: \033[0m%s\n", ptr);
    } else {
        printf("\033[1;31m• Ordering Conditions: \033[0mNot found\n");
    }
}

void printRawSQL(char *sql) {
    if (strlen(sql) == 0) {
        printf("No SQL query entered.\n");
        return;
    }
    printf("\n\033[1;36mRaw SQL:\033[0m\n");
    printf("%s\n", sql);
}

void printFormattedSQL(char *sql) {
    if (strlen(sql) == 0) {
        printf("No SQL query entered.\n");
        return;
    }
    printf("\n\033[1;36mFormatted SQL:\033[0m\n");

    const char *colors[] =         {"\033[1;32m", "\033[1;31m", "\033[1;34m", "\033[1;35m", "\033[1;36m", "\033[1;33m", "\033[1;33m", "\033[1;33m", "\033[1;33m"};
    const char *keywords_upper[] = {"SELECT",       "FROM",       "WHERE",       "JOIN",         "ON",          "GROUP", "BY",                 "ORDER", "BY"};
    const char *keywords[] = {"select", "from", "where", "join", "on", "group", "by", "order", "by", NULL};

    char *copySql = strdup(sql);
    char *token = strtok(copySql, " ");
    while (token != NULL) {
        int colored = 0;
        for (int i = 0; keywords[i] != NULL; i++) {
            if (strcasestr(token, keywords[i]) == token) {
                // Print new line before SELECT, FROM, WHERE, JOIN, GROUP, ORDER
                if (i == 0 || i == 1 || i == 2 || i == 3 || i == 5 || i == 7) {
                    printf("\n");
                }

                printf("%s%s\033[0m ", colors[i], keywords_upper[i]);
                colored = 1;
                break;
            }
        }
        if (!colored) {
            printf("%s ", token);
        }
        token = strtok(NULL, " ");
    }
    free(copySql); // Free the duplicated string
    printf("\n");
}

void readSQLFromFile(char *sql) {
    char filename[256];
    printf("Enter filename to read SQL from: ");
    fgets(filename, sizeof(filename), stdin);

    // Remove trailing newline character
    size_t len = strlen(filename);
    if (len > 0 && filename[len - 1] == '\n') {
        filename[len - 1] = '\0';
    }

    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        perror("Could not open file for reading");
        return;
    }

    fgets(sql, 1024, file);
    fclose(file);

    // Remove trailing newline character
    len = strlen(sql);
    if (len > 0 && sql[len - 1] == '\n') {
        sql[len - 1] = '\0';
    }

    printf("SQL read from %s\n", filename);
}

// Case-insensitive string search function
char* strcasestr(const char* str, const char* src) {
    if (!*src) return (char*)str;
    for (char *p1 = (char*)str; *p1; ++p1) {
        if (tolower((unsigned char)*p1) == tolower((unsigned char)*src)) {
            for (char *p2 = p1, *p3 = (char*)src; ; ) {
                if (!*p3) return p1;
                if (tolower((unsigned char)*p2++) != tolower((unsigned char)*p3++)) break;
            }
        }
    }
    return NULL;
}
