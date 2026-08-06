from google import genai

from decouple import config

from apps.rooms.models import Room
from apps.food.models import FoodItem
from apps.bookings.models import Booking


_gemini_model = None


def get_gemini_model():

    global _gemini_model


    if _gemini_model is not None:

        return _gemini_model


    api_key = config(

        'GEMINI_API_KEY',

        default=''
    ).strip()


    if not api_key:

        return None


    _gemini_model = genai.Client(
    api_key=api_key
)

    return _gemini_model


# =========================
# ROOM FILTERING
# =========================

def get_filtered_rooms(user_message):

    message = user_message.lower()


    rooms = Room.objects.filter(
        is_available=True
    )


    # CHEAP / BUDGET ROOMS

    if (
        'cheap' in message or
        'budget' in message or
        'low price' in message
    ):

        rooms = rooms.order_by(
            'price_per_night'
        )[:3]


    # LUXURY ROOMS

    elif (
        'luxury' in message or
        'premium' in message or
        'suite' in message
    ):

        rooms = rooms.filter(
            room_type='suite'
        )


    # FAMILY ROOMS

    elif (
        'family' in message or
        '4 people' in message
    ):

        rooms = rooms.filter(
            capacity__gte=4
        )


    return rooms


# =========================
# FOOD FILTERING
# =========================

def get_filtered_food(user_message):

    message = user_message.lower()


    food_items = FoodItem.objects.filter(
        available=True
    )


    # VEG FOOD

    if 'veg' in message:

        food_items = food_items.filter(
            category__icontains='veg'
        )


    # SPICY FOOD

    elif 'spicy' in message:

        food_items = food_items.filter(
            description__icontains='spicy'
        )


    # BIRYANI

    elif 'biryani' in message:

        food_items = food_items.filter(
            name__icontains='biryani'
        )


    return food_items


# =========================
# ROOM CONTEXT
# =========================

def build_room_context(rooms):

    if not rooms.exists():

        return "No matching rooms found."


    context = ""


    for room in rooms:

        context += f"""

        Room Number: {room.room_number}

        Room Type: {room.room_type}

        Price Per Night: ₹{room.price_per_night}

        Capacity: {room.capacity}

        Description: {room.description}

        -------------------------
        """


    return context


# =========================
# FOOD CONTEXT
# =========================

def build_food_context(food_items):

    if not food_items.exists():

        return "No matching food items found."


    context = ""


    for item in food_items:

        context += f"""

        Food Name: {item.name}

        Price: ₹{item.price}

        Category: {item.category}

        Description: {item.description}

        -------------------------
        """


    return context


# =========================
# BOOKING CONTEXT
# =========================

def build_booking_context(user):

    bookings = Booking.objects.filter(
        user=user
    ).exclude(
        status='cancelled'
    )


    if not bookings.exists():

        return "User has no active bookings."


    context = ""


    for booking in bookings:

        context += f"""

        Booking ID: {booking.id}

        Room Number: {booking.room.room_number}

        Room Type: {booking.room.room_type}

        Check In Date: {booking.check_in_date}

        Check Out Date: {booking.check_out_date}

        Booking Status: {booking.status}

        -------------------------
        """


    return context


# =========================
# MAIN AI RESPONSE FUNCTION
# =========================

def get_ai_response(user_message, user):

    model = get_gemini_model()


    if model is None:

        return (
            "The AI concierge is currently unavailable because the "
            "GEMINI_API_KEY environment variable is not configured. "
            "Please add the key on Render to enable chatbot responses."
        )


    # FILTER ROOMS

    filtered_rooms = get_filtered_rooms(
        user_message
    )


    # BUILD ROOM CONTEXT

    room_context = build_room_context(
        filtered_rooms
    )


    # FILTER FOOD

    filtered_food = get_filtered_food(
        user_message
    )


    # BUILD FOOD CONTEXT

    food_context = build_food_context(
        filtered_food
    )


    # BUILD BOOKING CONTEXT

    booking_context = build_booking_context(
        user
    )


    # FINAL PROMPT

    prompt = f"""

    You are Royal Stay Hotel AI Assistant.

    Your responsibilities:

    - Recommend hotel rooms
    - Recommend food items
    - Help hotel guests professionally
    - Answer booking-related questions
    - Use ONLY the provided hotel data


    =========================
    ROOM DATA
    =========================

    {room_context}


    =========================
    FOOD MENU DATA
    =========================

    {food_context}


    =========================
    USER BOOKING DATA
    =========================

    {booking_context}


    =========================
    USER QUESTION
    =========================

    {user_message}


    Give a professional, friendly, and helpful response.
    """


    response = model.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=prompt,
    )

    return response.text