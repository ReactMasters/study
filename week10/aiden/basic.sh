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