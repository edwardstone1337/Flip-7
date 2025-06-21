        // Game state
        let rounds = [
            {
                round: 1,
                cards: [],
                selectedCards: new Set(),
                score: 0,
                flip7: false,
                busted: false,
                saved: false
            }
        ];
        let currentRound = 1;
        let celebrationShown = false;

        // State persistence functions
        function saveGameState() {
            const gameState = {
                rounds: rounds.map(round => ({
                    ...round,
                    selectedCards: Array.from(round.selectedCards) // Convert Set to Array for storage
                })),
                currentRound: currentRound,
                celebrationShown: celebrationShown
            };
            localStorage.setItem('flip7GameState', JSON.stringify(gameState));
        }

        function loadGameState() {
            const savedState = localStorage.getItem('flip7GameState');
            if (savedState) {
                try {
                    const gameState = JSON.parse(savedState);
                    rounds = gameState.rounds.map(round => ({
                        ...round,
                        selectedCards: new Set(round.selectedCards) // Convert Array back to Set
                    }));
                    currentRound = gameState.currentRound;
                    celebrationShown = gameState.celebrationShown || false;
                    return true;
                } catch (error) {
                    console.error('Error loading game state:', error);
                    return false;
                }
            }
            return false;
        }

        function clearGameState() {
            localStorage.removeItem('flip7GameState');
        }

        // Save state before navigating away
        window.addEventListener('beforeunload', saveGameState);

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Try to load saved state, fall back to default if none exists
            const stateLoaded = loadGameState();
            
            initializeCards();
            updateDisplay();
            updateRoundsDisplay();
            
            // If state was loaded, apply visual selections
            if (stateLoaded) {
                loadRoundSelection();
            }
        });

        function initializeCards() {
            const cards = document.querySelectorAll('.card[data-type]');
            cards.forEach(card => {
                card.addEventListener('click', function() {
                    toggleCard(this);
                });
            });
        }

        function toggleCard(cardElement) {
            const cardType = cardElement.dataset.type;
            const cardValue = cardElement.dataset.value;
            const cardId = `${cardType}-${cardValue}`;
            const round = getCurrentRoundData();

            // If trying to select a number card, check the 7-card limit
            if (cardType === 'number' && !round.selectedCards.has(cardId)) {
                const numberCards = Array.from(round.selectedCards)
                    .filter(id => id.startsWith('number-'))
                    .length;
                
                if (numberCards >= 7) {
                    showError("You've already flipped 7 unique number cards! Time to bank your round and claim your Flip 7 bonus!");
                    return;
                }
            }

            if (round.selectedCards.has(cardId)) {
                // Deselect card
                round.selectedCards.delete(cardId);
                cardElement.classList.remove('selected');
            } else {
                // Select card
                round.selectedCards.add(cardId);
                cardElement.classList.add('selected');
            }

            updateDisplay();
            saveGameState(); // Save state after card selection changes
        }

        function getCurrentRoundData() {
            return rounds.find(r => r.round === currentRound) || rounds[rounds.length - 1];
        }

        function calculateScore(selectedCards) {
            const numberCards = [];
            const modifiers = [];
            let hasX2 = false;
            let hasDuplicates = false;

            // Parse selected cards
            selectedCards.forEach(cardId => {
                const [type, value] = cardId.split('-');
                if (type === 'number') {
                    numberCards.push(parseInt(value));
                } else if (type === 'modifier') {
                    if (value === 'x2') {
                        hasX2 = true;
                    } else {
                        modifiers.push(parseInt(value.substring(1))); // Remove the '+' sign
                    }
                }
            });

            // Check for duplicate number cards
            const uniqueNumbers = new Set(numberCards);
            hasDuplicates = uniqueNumbers.size !== numberCards.length;

            // If there are duplicates, return 0 score
            if (hasDuplicates) {
                return {
                    score: 0,
                    breakdown: 'Duplicate number cards - BUST!',
                    isFlip7: false
                };
            }

            // Calculate base score from number cards
            let numberScore = numberCards.reduce((sum, num) => sum + num, 0);

            // Check for Flip 7 bonus
            const isFlip7 = numberCards.length === 7;
            let flip7Bonus = isFlip7 ? 15 : 0;

            // Apply x2 multiplier to number cards only
            if (hasX2) {
                numberScore *= 2;
            }

            // Add modifier bonuses
            const modifierBonus = modifiers.reduce((sum, mod) => sum + mod, 0);

            // Calculate final score
            const finalScore = numberScore + flip7Bonus + modifierBonus;

            // Create breakdown string
            let breakdown = '';
            if (numberCards.length > 0) {
                breakdown += `Numbers: ${numberCards.join('+')} = ${numberCards.reduce((sum, num) => sum + num, 0)}`;
                if (hasX2) {
                    breakdown += ' ×2';
                }
            }
            if (isFlip7) {
                breakdown += (breakdown ? ' + ' : '') + 'Flip 7 Bonus: +15';
            }
            if (modifierBonus > 0) {
                breakdown += (breakdown ? ' + ' : '') + `Modifiers: +${modifierBonus}`;
            }
            if (hasX2 && numberCards.length === 0) {
                breakdown += '×2 Multiplier';
            }
            if (!breakdown) breakdown = 'No cards selected';

            return {
                score: finalScore,
                breakdown: breakdown,
                isFlip7: isFlip7
            };
        }

        function updateDisplay() {
            const round = getCurrentRoundData();
            const result = calculateScore(round.selectedCards);
            
            // Calculate banked score (all previous completed rounds, excluding busted rounds)
            const bankedScore = rounds
                .filter(r => r.saved && r.round < currentRound && !r.busted)
                .reduce((sum, r) => sum + r.score, 0);
            
            // Calculate real-time total
            const currentRoundScore = round.saved ? (round.busted ? 0 : round.score) : result.score;
            const realtimeTotal = bankedScore + currentRoundScore;

            // Update displays
            document.getElementById('banked-score').textContent = bankedScore;
            document.getElementById('realtime-score').textContent = realtimeTotal;
            document.getElementById('score-breakdown').textContent = result.breakdown;

            // Update status indicators
            const flip7Status = document.getElementById('flip7-status');
            flip7Status.classList.toggle('hidden', !result.isFlip7);

            // Update bank button
            const bankButton = document.getElementById('bank-button');
            bankButton.classList.add('primary');
            bankButton.innerHTML = '✓<div class="card-label">Bank</div>';

            // Update navigation
            updateNavigation();

            // Check for celebration (only when real-time total hits 200)
            if (realtimeTotal >= 200 && !celebrationShown) {
                showCelebration();
                celebrationShown = true;
            } else if (realtimeTotal < 200) {
                celebrationShown = false;
            }
        }

        function updateNavigation() {
            const prevButton = document.getElementById('prev-round');
            const nextButton = document.getElementById('next-round');
            const indicator = document.getElementById('round-indicator');

            indicator.textContent = `Round ${currentRound}`;
            prevButton.disabled = currentRound === 1;
            
            // Enable next if current round is saved or if there's already a next round
            const currentRoundData = getCurrentRoundData();
            const hasNextRound = rounds.some(r => r.round === currentRound + 1);
            nextButton.disabled = !currentRoundData.saved && !hasNextRound;
        }

        function goToPreviousRound() {
            if (currentRound > 1) {
                saveCurrentSelection();
                currentRound--;
                loadRoundSelection();
                updateDisplay();
                updateRoundsDisplay();
                saveGameState(); // Save state after navigation
            }
        }

        function goToNextRound() {
            const currentRoundData = getCurrentRoundData();
            if (currentRoundData.saved || rounds.some(r => r.round === currentRound + 1)) {
                saveCurrentSelection();
                currentRound++;
                
                // Create new round if it doesn't exist
                if (!rounds.some(r => r.round === currentRound)) {
                    rounds.push({
                        round: currentRound,
                        cards: [],
                        selectedCards: new Set(),
                        score: 0,
                        flip7: false,
                        busted: false,
                        saved: false
                    });
                }
                
                loadRoundSelection();
                updateDisplay();
                updateRoundsDisplay();
                saveGameState(); // Save state after navigation
            }
        }

        function goToRound(roundNumber) {
            saveCurrentSelection();
            currentRound = roundNumber;
            loadRoundSelection();
            updateDisplay();
            updateRoundsDisplay();
            saveGameState(); // Save state after navigation
        }

        function saveCurrentSelection() {
            const round = getCurrentRoundData();
            // Selection is already saved in the round object
        }

        function loadRoundSelection() {
            // Clear all visual selections
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });

            // Apply selections for current round
            const round = getCurrentRoundData();
            round.selectedCards.forEach(cardId => {
                const [type, value] = cardId.split('-');
                const cardElement = document.querySelector(`[data-type="${type}"][data-value="${value}"]`);
                if (cardElement) {
                    cardElement.classList.add('selected');
                }
            });
        }

        function bankRound() {
            const round = getCurrentRoundData();
            const result = calculateScore(round.selectedCards);
            
            // Update round data
            round.cards = Array.from(round.selectedCards).map(cardId => {
                const [type, value] = cardId.split('-');
                return type === 'number' ? value : (value === 'x2' ? '×2' : value);
            });
            round.score = result.score;
            round.flip7 = result.isFlip7;
            round.busted = false; // Banking removes bust status
            round.saved = true;

            // Update displays
            updateDisplay();
            updateRoundsDisplay();
            saveGameState(); // Save state after banking

            // Auto-advance to next round only if this is a new round
            if (currentRound === rounds.length) {
                    goToNextRound();
            }
        }

        function bustRound() {
            const round = getCurrentRoundData();
            
            // Update round data
            round.cards = Array.from(round.selectedCards).map(cardId => {
                const [type, value] = cardId.split('-');
                return type === 'number' ? value : (value === 'x2' ? '×2' : value);
            });
            round.score = 0;
            round.flip7 = false;
            round.busted = true;
            round.saved = true;

            // Update displays
            updateDisplay();
            updateRoundsDisplay();
            saveGameState(); // Save state after busting

            // Auto-advance to next round only if this is a new round
            if (currentRound === rounds.length) {
                    goToNextRound();
            }
        }

        function updateRoundsDisplay() {
            const roundsList = document.getElementById('rounds-list');
            const totalScore = rounds.filter(r => r.saved && !r.busted).reduce((sum, r) => sum + r.score, 0);
            
            document.getElementById('total-score').textContent = totalScore;

            roundsList.innerHTML = rounds.map(round => `
                <div class="round-item ${round.round === currentRound ? 'current' : ''}" onclick="goToRound(${round.round})">
                    <div class="round-info">
                        <div class="round-number">Round ${round.round}</div>
                        <div class="round-cards">${
                            round.saved 
                                ? round.cards.join(', ') + (round.busted ? ' 💥 BUST' : round.flip7 ? ' 🎯' : '')
                                : round.selectedCards.size > 0 
                                    ? 'In progress...' 
                                    : 'Not played yet'
                        }</div>
                    </div>
                    <div class="round-score" style="${round.busted ? 'color: #e53e3e; text-decoration: line-through;' : ''}">${
                        round.saved ? (round.busted ? '0' : round.score) : '—'
                    }</div>
                </div>
            `).join('');
        }

        function showRestartConfirmation() {
            document.getElementById('restart-modal').classList.remove('hidden');
        }

        function closeRestartConfirmation() {
            document.getElementById('restart-modal').classList.add('hidden');
        }

        function restartGame() {
            closeRestartConfirmation();
            rounds = [{
                round: 1,
                cards: [],
                selectedCards: new Set(),
                score: 0,
                flip7: false,
                busted: false,
                saved: false
            }];
            currentRound = 1;
            celebrationShown = false;
            
            // Clear all visual selections
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            
            updateDisplay();
            updateRoundsDisplay();
            clearGameState(); // Clear saved state when restarting
        }

        function showCelebration() {
            document.getElementById('celebration-modal').classList.remove('hidden');
            saveGameState(); // Save state when celebration is shown
        }

        function closeCelebration() {
            document.getElementById('celebration-modal').classList.add('hidden');
        }

        function showError(message) {
            document.getElementById('error-message').textContent = message;
            document.getElementById('error-modal').classList.remove('hidden');
        }

        function closeError() {
            document.getElementById('error-modal').classList.add('hidden');
        }

        function bankAndCloseError() {
            closeError();
            bankRound();
        }

        // Test function to verify warning scenarios
        function testWarningScenarios() {
            console.log("Testing warning scenarios...");
            
            // 1. Test 7-Card Limit Warning
            console.log("\n1. Testing 7-Card Limit Warning:");
            console.log("Select these number cards in order: 1,2,3,4,5,6,7");
            console.log("Then try to select an 8th number card");
            
            // 2. Test Duplicate Number Cards Warning
            console.log("\n2. Testing Duplicate Number Cards Warning:");
            console.log("Select number card '4'");
            console.log("Select number card '4' again");
            
            // 3. Test 200 Points Celebration
            console.log("\n3. Testing 200 Points Celebration:");
            console.log("To reach 200 points quickly:");
            console.log("1. Select cards: 7,8,9,10,11,12,13 (total 70)");
            console.log("2. Select ×2 modifier (doubles to 140)");
            console.log("3. Select +10 modifier (adds 10)");
            console.log("4. Bank the round (total 150)");
            console.log("5. Repeat with different numbers to reach 200");
            
            // 4. Test Empty Hand Banking/Busting
            console.log("\n4. Testing Empty Hand Banking/Busting:");
            console.log("You can now bank or bust with no cards selected (realistic game behavior)");
        }

        // Add test function to window for easy access
        window.testWarningScenarios = testWarningScenarios;