const { createApp } = Vue;

createApp({
  data() {
    return {
      form: {
        fullName: '',
        dob: '',
        gender: '',
        visitors: '',
        children: '',
        accommodation: '',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      },
      errors: {},
      generalError: '',
      places: [],
      isLoadingPlaces: true,
      placesError: false,
      selectedPlaces: [],
      accommodationOptions: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ],
      showSummary: false
    };
  },
  computed: {
    maskedCardNumber() {
      if (!this.form.cardNumber) return '';
      const digits = this.form.cardNumber.replace(/\D/g, ''); 
      if (digits.length < 4) return digits;
      return `**** **** **** ${digits.slice(-4)}`;
    }
  },
  methods: {
    async loadPlaces() {
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.places = data;
        this.isLoadingPlaces = false;
      } catch (error) {
        console.error("Failed to fetch places:", error);
        this.placesError = true;
        this.isLoadingPlaces = false;
      }
    },
    
    togglePlace(place) {
      const index = this.selectedPlaces.findIndex(p => p.id === place.id);
      if (index === -1) {
        this.selectedPlaces.push(place);
      } else {
        this.selectedPlaces.splice(index, 1);
      }
    },

    clearErrors() {
      this.errors = {};
      this.generalError = '';
    },

    validateForm() {
      let isValid = true;

      if (!this.form.fullName.trim()) { this.errors.fullName = "Full Name is required."; isValid = false; }
      if (!this.form.dob) { this.errors.dob = "Date of Birth is required."; isValid = false; }
      if (!this.form.gender) { this.errors.gender = "Gender selection is required."; isValid = false; }

      if (this.selectedPlaces.length === 0) {
        this.errors.places = "Please select at least one place from the park.";
        isValid = false;
      }

      if (!this.form.visitors || this.form.visitors < 1) { this.errors.visitors = "Total visitors must be at least 1."; isValid = false; }
      if (this.form.children === '' || this.form.children < 0) { this.errors.children = "Number of children is required (minimum 0)."; isValid = false; }

      if (!this.form.accommodation) { this.errors.accommodation = "Please select an accommodation option."; isValid = false; }

      if (!this.form.cardName.trim()) { this.errors.cardName = "Name on card is required."; isValid = false; }
      if (!this.form.cardNumber.trim()) { this.errors.cardNumber = "Card number is required."; isValid = false; }
      if (!this.form.expiry) { this.errors.expiry = "Expiration date is required."; isValid = false; }
      if (!this.form.cvv.trim()) { this.errors.cvv = "CVC is required."; isValid = false; }

      return isValid;
    },

    generateItinerary() {
      this.clearErrors(); 
      
      const isValid = this.validateForm(); 
      
      if (isValid) {
        this.showSummary = true;
      } else {
        this.generalError = "There are mandatory items pending to be filled. Please complete the required fields.";
      }
    },

    resetForm() {
      this.showSummary = false;
      this.form = { fullName: '', dob: '', gender: '', visitors: '', children: '', accommodation: '', cardName: '', cardNumber: '', expiry: '', cvv: '' };
      this.selectedPlaces = [];
      this.clearErrors();
    }
  },
  mounted() {
    this.loadPlaces();
  }
}).mount('#app');