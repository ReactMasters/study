# Shell script

**What is a kernel?**

A kernel is a program that can control an operating system at the lowest level such as managing processes, memory, I/O, and hardware.

**What is a shell?**

A shell is also a program that can control and communicate with the operating system but it's more abstracted than a kernel and works on a higher level. A human or another program can interact with an operating system using a shell. A shell can be presented in a form of either GUI or CLI.

**What is a Unix shell?**

A shell is a program to interact with an operating system... A Unix shell is a program to interact with a Unix-like operating system. That was easy! Operating systems like Windows have a shell but a shell usually refers to a Unix shell.

**What is a shell script?**

A shell script is a scripting language that can be run by a shell. 

**Types of shells**
Again, a shell is just a program or an interface to communicate with an operating system so there are different types of shells that implement different syntaxes and functionalities. A lot of them are written in C and below are the most well-known shells.
****Thompson shell: the very first shell created by Ken Thompson
Bourne shell
Korn shell
**Bourne again shell(Bash)**
Z shell(zsh): The default shell on mac

PowerShell, Git Bash
: If you are a Windows user, you have probably used Git Bash on Windows. Windows has "batch script(.bat)" which is equivalent to Unix-like systems' shell script but a lot of programmers are more familiar with shell script and commands. Git Bash has been one of the most popular ways that enable the users to use shell commands on Windows but now you can use the built-in PowerShell as well

Bash is one of the most widely used shells and a default shell for many Linux-based operating systems. 

Bash shell

```bash
#! /bin/bash
# shebang: Sharp(#) + !(bang). Detemines what shell script to use

# comments: #

# Variables
MYVAR=10

# This works too but it displays an error "command not found: 10"
# MYVAR= 10 

# String interpolation
# Only double quotes work
echo "MYVAR IS $MYVAR" # MYVAR IS 10
echo 'MYVAR IS $MYVAR' # MYVAR IS $MYVAR

# read command
read INPUT
echo "INPUT IS $INPUT"
read
echo "REPLY IS $REPLY"
read -p "ENTER A VALUE" INPUT
echo "UPDATED INPUT IS $INPUT"

# Conditional Statement
if [ $INPUT == 3 ]
# if [ $INPUT == 3 ] then. this does not work
then
	echo "INPUT is 10"
elif [ $INPUT == 4 ]
then
	echo "INPUT is 4"
elif [ $INPUT -eq 5 ]
then
    echo "INPUT is 5"
# elif [ $INPUT -gt 6] this does not work
elif [ $INPUT -gt 6 ]
then
    echo "INPUT IS GREATER THAN 6"
else
	echo "WHAT THE HECK"
fi

if [ -f "../aiden/file.txt" ]
then
    echo "file.txt is a file"
fi

read -p "Enter a number" MYNUM

case $MYNUM in
    [oO][nN][eE] | 원)
    echo "You entered one"
    ;;
    [tT][wW][oO] | 투)
    echo "You entered two"
    ;;
    *)
    echo "Get out"
esac

NUMBERS="1 2 3"
for NUMBER in $NUMBERS
    do
        echo "NUMBER $NUMBER"
done

FOLDER="./files"
FILES=$(ls $FOLDER)
for FILE in $FILES
    do
        echo $FILE
        cp "$FOLDER/$FILE" "$FOLDER/$FILE copy"
    done

LINE=1
while read -r CURRENT_LINE # -r : backslash does not act as an escape character
    do
        echo "$LINE : $CURRENT_LINE"
        # ((LINE++))
        # ((LINE=LINE+1))
        # LINE=$((LINE+1))
        # let LINE=LINE+1
    done < "./files/file1" # < : redirect stream

function whatUp(){
    echo "Not much"
}

function menu(){
    echo "Breakfast: $1 Lunch: $2 Dinner: $3"
}

whatUp

menu "빵" "밥" "밥"

echo "HELLO" >> "./files/file2"
```

[https://en.wikipedia.org/wiki/Kernel_(operating_system)](https://en.wikipedia.org/wiki/Kernel_(operating_system))
[https://en.wikipedia.org/wiki/Unix_shell](https://en.wikipedia.org/wiki/Unix_shell)
[https://www.youtube.com/watch?v=v-F3YLd6oMw](https://www.youtube.com/watch?v=v-F3YLd6oMw)