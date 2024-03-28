
import math
#get input of height and width and send to suit function according the type tower
def getHeightWidth(typeTower):
    print("input the height and width of the tower")      
    height = int(input("Enter height: "))
    #Checks if the input is correct if it does not ask to enter again
    while (height < 2): 
        height = int(input("The height of a tower must be greater than or equal to 2,\n please enter again: "))
    width = int (input("Enter width: "))
    if typeTower == "Rectangle":
        rectangle(height, width)
    else:
        triangle(height, width)

#Prints the area of the rectangle if the difference between the height and width is greater than five 
#otherwise does not print the perimeter
def rectangle(height, width):
    if abs(height - width) > 5:
        print("The area of the rectangle:" , height * width)
    else:
        print("Perimeter of the rectangle:", 2 * (height + width))

#Template for printing a line
def printRow(space, symbol):
    for s in range(space):
        print(" ", end="")
    for co in range(symbol):
        print ("*", end="")
    print()

#Prints the perimeter or print the triangle according to the user's requirement
def triangle(height,width):
    choice = int(input("Enter 1 for calculation of the perimeter of the triangle or 2 for printing the triangle: "))
    if choice == 1 :
        # Calculation of sides of the triangle using Pythagoras theorem
        side = math.sqrt((width / 2) ** 2 + height ** 2)
        perimeter = 2 * side + width
        print("Calculation of the perimeter of the triangle: ",perimeter)
  
    else:
        count = 0 
        # Counting the number of odd numbers within the specified width range
        for n in range(1,width-2):
            if n % 2 !=0:
                count=count+1
        # Printing the first row of the triangle
        printRow(int(width/2), 1)

        lheighr= height-2
        mis = 3

        count_fit = int(lheighr / count)

        # Printing the triangle with regular height
        if (height - 2 / count) % 2 == 0:
            for i in range(0, lheighr, count_fit):
                for c in range(count_fit):
                    if mis < width:
                        space = (width - mis) // 2
                        printRow(space, mis)
                mis=mis+2    
        else:
            # Printing the triangle with irregular height
            remainder = (lheighr % count)
            d = 1
            for i in range(0, lheighr, d):
                if i < count_fit + remainder:
                    space = (width - mis) // 2
                    printRow(space, mis)
                #Checks if it is possible to start printing rows of stars with the same count
                if i+1 ==  count_fit + remainder:
                    mis += 2 
                #Print star rows with the same count
                if i >= count_fit + remainder: 
                    for c in range(count_fit):
                        if mis < width:
                            space = (width - mis) // 2
                            printRow(space, mis)
                    d = count_fit
                    mis += 2 

        # Printing the last row of the triangle
        for last in range(width):
            print("*", end="")
        print()


    

def main():
    choice = 0
    while choice != 3:
        print("\nMenu: 1 for Rectangle, 2 for Triangle, 3 for Exit")      
        choice = int(input("Enter your choice: "))

        if choice == 1:
            print("You selected Option 1 (Rectangle)")
            getHeightWidth("Rectangle")
        elif choice == 2:
            print("You selected Option 2 (Triangle)")
            getHeightWidth("Triangle")
        elif choice == 3:
            print("Exiting...")
        else:
            print("Invalid choice. Please enter a valid option.")

if __name__ == "__main__":
    main()
