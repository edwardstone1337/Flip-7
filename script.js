        function trackEvent(eventName, params) {
            if (typeof gtag === 'function') {
                gtag('event', eventName, params);
            }
        }

        // Game state - Multiplayer structure
        let gameState = {
            players: [
                {
                    id: 'p1',
                    name: 'Player 1',
                    rounds: [
                        {
                            round: 1,
                            cards: [],
                            selectedCards: new Set(),
                            score: 0,
                            flip7: false,
                            busted: false,
                            saved: false
                        }
                    ],
                    currentRound: 1,
                    celebrationShown: false
                }
            ],
            activePlayerId: 'p1',
            version: 2
        };

        // Navbar scroll functionality
        let lastScrollTop = 0;
        let navbar = null;

        // State persistence functions
        function saveGameState() {
            const stateToSave = {
                players: gameState.players.map(player => ({
                    ...player,
                    rounds: player.rounds.map(round => ({
                        ...round,
                        selectedCards: Array.from(round.selectedCards) // Convert Set to Array for storage
                    }))
                })),
                activePlayerId: gameState.activePlayerId,
                version: 2
            };
            localStorage.setItem('flip7GameState', JSON.stringify(stateToSave));
        }

        function loadGameState() {
            const savedState = localStorage.getItem('flip7GameState');
            if (savedState) {
                try {
                    const loadedState = JSON.parse(savedState);
                    
                    // Check if this is v1 (single-player) format
                    if (!loadedState.version || loadedState.version === 1) {
                        // Migrate v1 to v2
                        gameState = {
                            players: [
                                {
                                    id: 'p1',
                                    name: 'Player 1',
                                    rounds: loadedState.rounds.map(round => ({
                                        ...round,
                                        selectedCards: new Set(round.selectedCards)
                                    })),
                                    currentRound: loadedState.currentRound,
                                    celebrationShown: loadedState.celebrationShown || false
                                }
                            ],
                            activePlayerId: 'p1',
                            version: 2
                        };
                    } else {
                        // Load v2 format
                        gameState = {
                            players: loadedState.players.map(player => ({
                                ...player,
                                rounds: player.rounds.map(round => ({
                                    ...round,
                                    selectedCards: new Set(round.selectedCards)
                                }))
                            })),
                            activePlayerId: loadedState.activePlayerId,
                            version: 2
                        };
                    }
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
            // Initialize navbar scroll functionality
            initializeNavbarScroll();
            
            // Try to load saved state, fall back to default if none exists
            const stateLoaded = loadGameState();
            
            initializeCards();
            updatePlayerStrip();
            updateDisplay();
            updateRoundsDisplay();
            
            // If state was loaded, apply visual selections
            if (stateLoaded) {
                loadRoundSelection();
            }

            // Add keyboard event listeners for input fields
            document.getElementById('add-player-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    confirmAddPlayer();
                }
            });

            document.getElementById('rename-player-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    confirmRenamePlayer();
                }
            });

            // Add click-outside-to-dismiss for leaderboard modal
            const leaderboardModal = document.getElementById('leaderboard-modal');
            if (leaderboardModal) {
                leaderboardModal.addEventListener('click', function(e) {
                    // Close modal if clicking on the backdrop (not the content)
                    if (e.target === leaderboardModal) {
                        closeLeaderboard();
                    }
                });
            }

            // Coffee link tracking
            document.querySelectorAll('a[href*="buymeacoffee.com/edthedesigner"]').forEach(function(link) {
                link.addEventListener('click', function() {
                    var location = 'footer';
                    if (this.closest('#celebration-coffee-mini')) {
                        location = 'celebration';
                    } else if (this.closest('#celebration-coffee')) {
                        location = 'leaderboard';
                    }
                    trackEvent('coffee_click', { location: location });
                });
            });

            // Feedback link tracking
            document.querySelectorAll('.feedback-link').forEach(function(link) {
                link.addEventListener('click', function() {
                    var location = 'footer';
                    if (this.closest('#celebration-modal')) {
                        location = 'celebration';
                    } else if (this.closest('#leaderboard-modal')) {
                        location = 'leaderboard';
                    }
                    trackEvent('feedback_click', { location: location });
                });
            });

            // Nav link tracking
            document.querySelectorAll('.nav-link:not(.share-button), .nav-logo-link, .footer-link').forEach(function(link) {
                link.addEventListener('click', function() {
                    trackEvent('nav_click', { destination: this.getAttribute('href') || this.textContent.trim() });
                });
            });

            // Dynamic QR code generation (run once at init)
            var qrImg = document.querySelector('#share-modal img[src*="flip7-qr"]');
            if (qrImg && typeof qrcode !== 'undefined') {
                var qr = qrcode(0, 'M');
                qr.addData('https://flip7scorecard.com?utm_source=share&utm_medium=qr_code');
                qr.make();
                qrImg.src = qr.createDataURL(8, 0);
                qrImg.alt = 'Scan to open Flip 7 Scorecard';
            }
        });

        function initializeNavbarScroll() {
            navbar = document.querySelector('.top-nav');
            if (!navbar) return;

            let scrollTimeout;
            
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const isScrollingDown = scrollTop > lastScrollTop;
                const isAtTop = scrollTop <= 0;
                
                // Always show navbar at the top
                if (isAtTop) {
                    navbar.classList.remove('nav-hidden');
                    navbar.classList.remove('nav-visible');
                } else if (isScrollingDown && scrollTop > 100) {
                    // Hide navbar when scrolling down (after 100px)
                    navbar.classList.add('nav-hidden');
                    navbar.classList.remove('nav-visible');
                } else if (!isScrollingDown && scrollTop > 100) {
                    // Show navbar when scrolling up (after 100px)
                    navbar.classList.remove('nav-hidden');
                    navbar.classList.add('nav-visible');
                }
                
                lastScrollTop = scrollTop;
                
                // Add a small delay to prevent flickering
                scrollTimeout = setTimeout(() => {
                    if (scrollTop > 100 && !isScrollingDown) {
                        navbar.classList.add('nav-visible');
                    }
                }, 50);
            });
        }

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
                trackEvent('card_select', { card_type: cardType, card_value: cardValue });
            }

            updateDisplay();
            saveGameState(); // Save state after card selection changes
        }

        // Helper functions for multiplayer
        function getCurrentPlayer() {
            if (!gameState.players || gameState.players.length === 0) {
                console.error('No players in game state');
                return null;
            }
            return gameState.players.find(p => p.id === gameState.activePlayerId) || gameState.players[0];
        }

        function getCurrentRoundData() {
            const player = getCurrentPlayer();
            if (!player || !player.rounds || player.rounds.length === 0) {
                console.error('No rounds found for current player');
                return null;
            }
            return player.rounds.find(r => r.round === player.currentRound) || player.rounds[player.rounds.length - 1];
        }

        function generatePlayerId() {
            return 'p' + Date.now() + Math.random().toString(36).substr(2, 9);
        }

        function getPlayerInitials(name) {
            return name.split(' ')
                .map(word => word[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase() || '?';
        }

        function getPlayerTotal(player) {
            return player.rounds
                .filter(r => r.saved && !r.busted)
                .reduce((sum, r) => sum + r.score, 0);
        }

        // Player management functions
        function addPlayer(name) {
            if (gameState.players.length >= 18) {
                showError("Maximum 18 players reached!");
                return;
            }

            const playerNumber = gameState.players.length + 1;
            const newPlayer = {
                id: generatePlayerId(),
                name: name && name.trim() ? name.trim() : `Player ${playerNumber}`,
                rounds: [
                    {
                        round: 1,
                        cards: [],
                        selectedCards: new Set(),
                        score: 0,
                        flip7: false,
                        busted: false,
                        saved: false
                    }
                ],
                currentRound: 1,
                celebrationShown: false
            };

            gameState.players.push(newPlayer);
            switchToPlayer(newPlayer.id);
            saveGameState();
        }

        function switchToPlayer(playerId) {
            saveCurrentSelection();
            gameState.activePlayerId = playerId;
            loadRoundSelection();
            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState();
        }

        function showPlayerMenu(playerId) {
            const player = gameState.players.find(p => p.id === playerId);
            if (!player) return;
            window.currentMenuPlayerId = playerId;

            const titleEl = document.getElementById('player-menu-title');
            const emojiEl = document.getElementById('player-menu-emoji');
            const bodyEl = document.getElementById('player-menu-body');
            const isSinglePlayer = gameState.players.length <= 1;

            if (isSinglePlayer) {
                emojiEl.textContent = '✏️';
                titleEl.textContent = 'Rename Player';
                bodyEl.innerHTML = `
            <input
                type="text"
                id="inline-rename-input"
                class="player-input"
                placeholder="New player name"
                maxlength="20"
                value="${player.name.replace(/"/g, '&quot;')}"
            />
            <div class="modal-buttons">
                <button onclick="closePlayerMenu()" class="modal-button secondary">Cancel</button>
                <button onclick="confirmInlineRename()" class="modal-button primary">Save</button>
            </div>
        `;
                document.getElementById('player-menu-modal').classList.remove('hidden');
                setTimeout(() => {
                    const input = document.getElementById('inline-rename-input');
                    if (input) {
                        input.focus();
                        input.select();
                        input.addEventListener('keypress', function(e) {
                            if (e.key === 'Enter') {
                                confirmInlineRename();
                            }
                        });
                    }
                }, 100);
            } else {
                emojiEl.textContent = '';
                titleEl.textContent = player.name;
                bodyEl.innerHTML = `
            <div class="modal-buttons-vertical">
                <button onclick="showRenamePlayerModal()" class="modal-button primary">Rename Player</button>
                <button onclick="showRemovePlayerConfirm()" class="modal-button danger">Remove Player</button>
                <button onclick="closePlayerMenu()" class="modal-button secondary">Cancel</button>
            </div>
        `;
                document.getElementById('player-menu-modal').classList.remove('hidden');
            }
        }

        function closePlayerMenu() {
            document.getElementById('player-menu-modal').classList.add('hidden');
            window.currentMenuPlayerId = null;
        }

        function showAddPlayerModal() {
            document.getElementById('add-player-input').value = '';
            document.getElementById('add-player-modal').classList.remove('hidden');
            setTimeout(() => document.getElementById('add-player-input').focus(), 100);
        }

        function closeAddPlayerModal() {
            document.getElementById('add-player-modal').classList.add('hidden');
        }

        function confirmAddPlayer() {
            const name = document.getElementById('add-player-input').value;
            addPlayer(name);
            trackEvent('player_add', { player_count: gameState.players.length });
            closeAddPlayerModal();
        }

        function showRenamePlayerModal() {
            // Save playerId BEFORE closing menu (which nulls currentMenuPlayerId)
            const playerId = window.currentMenuPlayerId;
            const player = gameState.players.find(p => p.id === playerId);
            
            closePlayerMenu();
            
            if (!player) return;

            // Re-set it so confirmRenamePlayer can use it
            window.currentMenuPlayerId = playerId;
            document.getElementById('rename-player-input').value = player.name;
            document.getElementById('rename-player-modal').classList.remove('hidden');
            setTimeout(() => document.getElementById('rename-player-input').focus(), 100);
        }

        function closeRenamePlayerModal() {
            document.getElementById('rename-player-modal').classList.add('hidden');
        }

        function confirmRenamePlayer() {
            const newName = document.getElementById('rename-player-input').value;
            const player = gameState.players.find(p => p.id === window.currentMenuPlayerId);
            
            if (player) {
                if (newName && newName.trim()) {
                    player.name = newName.trim();
                    updatePlayerStrip();
                    saveGameState();
                    trackEvent('player_rename');
                } else {
                    // If empty, keep the current name - just close modal
                }
            }
            
            closeRenamePlayerModal();
            window.currentMenuPlayerId = null;
        }

        function confirmInlineRename() {
            const input = document.getElementById('inline-rename-input');
            const newName = input ? input.value : '';
            const player = gameState.players.find(p => p.id === window.currentMenuPlayerId);

            if (player) {
                if (newName && newName.trim()) {
                    player.name = newName.trim();
                    updatePlayerStrip();
                    saveGameState();
                    trackEvent('player_rename');
                }
            }

            closePlayerMenu();
            window.currentMenuPlayerId = null;
        }

        function showRemovePlayerConfirm() {
            // Save playerId BEFORE closing menu (which nulls currentMenuPlayerId)
            const playerId = window.currentMenuPlayerId;
            const player = gameState.players.find(p => p.id === playerId);
            
            closePlayerMenu();
            
            if (!player) return;

            if (gameState.players.length === 1) {
                showError("You need at least one player.", 'reset');
                return;
            }

            // Re-set it so confirmRemovePlayer can use it
            window.currentMenuPlayerId = playerId;
            document.getElementById('remove-player-name').textContent = player.name;
            document.getElementById('remove-player-modal').classList.remove('hidden');
        }

        function closeRemovePlayerModal() {
            document.getElementById('remove-player-modal').classList.add('hidden');
        }

        function confirmRemovePlayer() {
            const playerId = window.currentMenuPlayerId;
            const playerIndex = gameState.players.findIndex(p => p.id === playerId);
            
            if (playerIndex === -1) {
                closeRemovePlayerModal();
                return;
            }

            // Remove the player
            gameState.players.splice(playerIndex, 1);

            // If we removed the active player, switch to nearest neighbor
            if (gameState.activePlayerId === playerId) {
                const newIndex = Math.min(playerIndex, gameState.players.length - 1);
                gameState.activePlayerId = gameState.players[newIndex].id;
                loadRoundSelection();
            }

            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState();
            trackEvent('player_remove', { player_count: gameState.players.length });
            closeRemovePlayerModal();
            window.currentMenuPlayerId = null;
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

        function updatePlayerStrip() {
            const playerStrip = document.getElementById('player-strip');
            if (!playerStrip) return;

            const chips = gameState.players.map(player => {
                const total = getPlayerTotal(player);
                const initials = getPlayerInitials(player.name);
                const isActive = player.id === gameState.activePlayerId;

                return `
                    <div class="player-chip ${isActive ? 'active' : ''}" onclick="switchToPlayer('${player.id}')">
                        <div class="player-chip-content">
                            <div class="player-initials">${initials}</div>
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-total">${total}</div>
                            </div>
                        </div>
                        <button class="player-menu-btn" onclick="event.stopPropagation(); showPlayerMenu('${player.id}')">⋮</button>
                    </div>
                `;
            }).join('');

            const addButton = gameState.players.length >= 18
                ? `<div class="add-player-chip disabled">Max 18 players</div>`
                : `<div class="add-player-chip" onclick="showAddPlayerModal()">+ Add player</div>`;

            playerStrip.innerHTML = chips + addButton;
        }

        function updateDisplay() {
            const player = getCurrentPlayer();
            const round = getCurrentRoundData();
            
            if (!player || !round) {
                console.error('Cannot update display: missing player or round data');
                return;
            }
            
            const result = calculateScore(round.selectedCards);
            
            // Calculate banked score (all previous completed rounds, excluding busted rounds)
            const bankedScore = player.rounds
                .filter(r => r.saved && r.round < player.currentRound && !r.busted)
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
        }

        function updateNavigation() {
            const player = getCurrentPlayer();
            if (!player) return;
            
            const prevButton = document.getElementById('prev-round');
            const nextButton = document.getElementById('next-round');
            const indicator = document.getElementById('round-indicator');

            indicator.textContent = `Round ${player.currentRound}`;
            prevButton.disabled = player.currentRound === 1;
            
            // Enable next if current round is saved or if there's already a next round
            const currentRoundData = getCurrentRoundData();
            if (!currentRoundData) {
                nextButton.disabled = true;
                return;
            }
            const hasNextRound = player.rounds.some(r => r.round === player.currentRound + 1);
            nextButton.disabled = !currentRoundData.saved && !hasNextRound;
        }

        function goToPreviousRound() {
            const player = getCurrentPlayer();
            if (!player) return;
            
            if (player.currentRound > 1) {
                saveCurrentSelection();
                player.currentRound--;
                loadRoundSelection();
                updateDisplay();
                updateRoundsDisplay();
                saveGameState(); // Save state after navigation
            }
        }

        function goToNextRound() {
            const player = getCurrentPlayer();
            if (!player) return;
            
            const currentRoundData = getCurrentRoundData();
            if (!currentRoundData) return;
            
            if (currentRoundData.saved || player.rounds.some(r => r.round === player.currentRound + 1)) {
                saveCurrentSelection();
                player.currentRound++;
                
                // Create new round if it doesn't exist
                if (!player.rounds.some(r => r.round === player.currentRound)) {
                    player.rounds.push({
                        round: player.currentRound,
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
            const player = getCurrentPlayer();
            if (!player) return;
            
            saveCurrentSelection();
            player.currentRound = roundNumber;
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
            const player = getCurrentPlayer();
            const round = getCurrentRoundData();
            console.warn('[bankRound] called', { player: !!player, round: !!round, selectedCards: round?.selectedCards, isSet: round?.selectedCards instanceof Set });
            if (!player || !round) {
                console.error('[bankRound] EARLY RETURN — player or round is null', { player, round });
                return;
            }

            let result;
            try {
                result = calculateScore(round.selectedCards);
            } catch (e) {
                console.error('[bankRound] calculateScore threw:', e, { selectedCards: round.selectedCards });
                return;
            }
            
            // Update round data
            round.cards = Array.from(round.selectedCards).map(cardId => {
                const [type, value] = cardId.split('-');
                return type === 'number' ? value : (value === 'x2' ? '×2' : value);
            });
            round.score = result.score;
            round.flip7 = result.isFlip7;
            round.busted = false; // Banking removes bust status
            round.saved = true;

            // Calculate NEW banked total AFTER this round is saved
            const newBankedTotal = player.rounds
                .filter(r => r.saved && !r.busted)
                .reduce((sum, r) => sum + r.score, 0);

            // Check for celebration (only when BANKING 200+)
            const shouldCelebrate = newBankedTotal >= 200 && !player.celebrationShown;
            
            if (shouldCelebrate) {
                player.celebrationShown = true;
            } else if (newBankedTotal < 200) {
                // Reset celebration flag if score falls below 200 (allows re-celebration)
                player.celebrationShown = false;
            }

            // Update displays
            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState(); // Save state after banking

            trackEvent('round_bank', { round_number: player.currentRound, round_score: round.score });

            // Show celebration AFTER updating displays and saving
            if (shouldCelebrate) {
                showLeaderboard(player);
            }

            // Auto-advance to next round only if this is a new round
            if (player.currentRound === player.rounds.length) {
                    goToNextRound();
            }
        }

        function bustRound() {
            const player = getCurrentPlayer();
            const round = getCurrentRoundData();
            
            if (!player || !round) return;
            
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
            updatePlayerStrip();
            saveGameState(); // Save state after busting

            trackEvent('round_bust', { round_number: player.currentRound });

            // Auto-advance to next round only if this is a new round
            if (player.currentRound === player.rounds.length) {
                    goToNextRound();
            }
        }

        function updateRoundsDisplay() {
            const player = getCurrentPlayer();
            if (!player) return;
            
            const roundsList = document.getElementById('rounds-list');
            const totalScore = player.rounds.filter(r => r.saved && !r.busted).reduce((sum, r) => sum + r.score, 0);
            
            document.getElementById('total-score').textContent = totalScore;

            roundsList.innerHTML = player.rounds.map(round => `
                <div class="round-item ${round.round === player.currentRound ? 'current' : ''}" onclick="goToRound(${round.round})">
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

        function showResetConfirmation() {
            const isSinglePlayer = gameState.players.length <= 1;
            const titleEl = document.getElementById('reset-modal-title');
            const bodyEl = document.getElementById('reset-modal-body');

            if (isSinglePlayer) {
                titleEl.textContent = 'New Game?';
                bodyEl.innerHTML = `
            <div class="reset-modal-description">This will clear all your scores and rounds.</div>
            <div class="modal-buttons">
                <button onclick="closeResetConfirmation()" class="modal-button secondary">Cancel</button>
                <button onclick="resetAllPlayersAndClose()" class="modal-button primary">New Game</button>
            </div>
        `;
            } else {
                titleEl.textContent = 'Reset Options';
                bodyEl.innerHTML = `
            <div class="reset-options-container">
                <div class="reset-option" onclick="resetAllPlayersAndClose()">
                    <div class="reset-option-title">New Game</div>
                    <div class="reset-option-desc">Clear all scores and rounds, keep all players</div>
                </div>
                <div class="reset-option danger" onclick="resetEntireGameAndClose()">
                    <div class="reset-option-title">Start Fresh</div>
                    <div class="reset-option-desc">Remove all players and start over</div>
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="closeResetConfirmation()" class="modal-button secondary full-width">Cancel</button>
            </div>
        `;
            }

            document.getElementById('reset-modal').classList.remove('hidden');
        }

        function closeResetConfirmation() {
            document.getElementById('reset-modal').classList.add('hidden');
        }

        function resetAllPlayersAndClose() {
            closeResetConfirmation();
            trackEvent('game_reset', { reset_type: 'all' });
            gameState.players.forEach(player => {
                player.rounds = [{
                    round: 1,
                    cards: [],
                    selectedCards: new Set(),
                    score: 0,
                    flip7: false,
                    busted: false,
                    saved: false
                }];
                player.currentRound = 1;
                player.celebrationShown = false;
            });
            loadRoundSelection();
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState();
        }

        function resetEntireGameAndClose() {
            closeResetConfirmation();
            trackEvent('game_reset', { reset_type: 'entire' });
            gameState.players = [{
                id: 'p1',
                name: 'Player 1',
                rounds: [{
                    round: 1,
                    cards: [],
                    selectedCards: new Set(),
                    score: 0,
                    flip7: false,
                    busted: false,
                    saved: false
                }],
                currentRound: 1,
                celebrationShown: false
            }];
            gameState.activePlayerId = 'p1';
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState();
        }

        function showLeaderboard(winningPlayer = null) {
            updateLeaderboardDisplay();
            
            // If there's a winning player, show celebration announcement
            if (winningPlayer) {
                trackEvent('game_complete');
                const total = getPlayerTotal(winningPlayer);
                document.getElementById('leaderboard-emoji').textContent = '🎉';
                document.getElementById('leaderboard-title').textContent = 'Congratulations!';
                document.getElementById('winner-name').textContent = winningPlayer.name;
                document.getElementById('winner-score').textContent = total;
                document.getElementById('winner-announcement').classList.remove('hidden');
                document.getElementById('leaderboard-section-label').classList.remove('hidden');
                document.getElementById('celebration-coffee').classList.remove('hidden');
                
                // Create confetti effect
                createConfetti();
            } else {
                // Just showing leaderboard (no winner)
                document.getElementById('leaderboard-emoji').textContent = '🏆';
                document.getElementById('leaderboard-title').textContent = 'Game Standings';
                document.getElementById('winner-announcement').classList.add('hidden');
                document.getElementById('leaderboard-section-label').classList.add('hidden');
                document.getElementById('celebration-coffee').classList.add('hidden');
            }
            
            document.getElementById('leaderboard-modal').classList.remove('hidden');
            saveGameState(); // Save state when leaderboard is shown
        }

        function closeLeaderboard() {
            document.getElementById('leaderboard-modal').classList.add('hidden');
            // Clear confetti
            const confettiContainer = document.getElementById('confetti-container');
            if (confettiContainer) {
                confettiContainer.innerHTML = '';
            }
        }

        function createConfetti() {
            const confettiContainer = document.getElementById('confetti-container');
            confettiContainer.innerHTML = '';
            
            const colors = ['#fbb03a', '#fbcf8a', '#1d9995', '#2b3276', '#fff4d2'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                confettiContainer.appendChild(confetti);
            }
        }

        function updateLeaderboardDisplay() {
            const leaderboardList = document.getElementById('leaderboard-list');
            
            // Sort players by total score descending
            const sortedPlayers = [...gameState.players].sort((a, b) => {
                return getPlayerTotal(b) - getPlayerTotal(a);
            });

            leaderboardList.innerHTML = sortedPlayers.map((player, index) => {
                const total = getPlayerTotal(player);
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                
                return `
                    <div class="leaderboard-item ${player.id === gameState.activePlayerId ? 'active-player' : ''}">
                        <div class="leaderboard-rank">${rankEmoji || (index + 1) + '.'}</div>
                        <div class="leaderboard-player">
                            <div class="leaderboard-name">${player.name}</div>
                        </div>
                        <div class="leaderboard-score">${total}</div>
                    </div>
                `;
            }).join('');
        }

        function toggleRoundsSection() {
            const roundsSection = document.getElementById('rounds-section');
            const toggleBtn = document.getElementById('toggle-rounds-btn');
            
            if (roundsSection.classList.contains('hidden')) {
                roundsSection.classList.remove('hidden');
                toggleBtn.textContent = 'Hide Rounds';
                updateRoundsDisplay();
            } else {
                roundsSection.classList.add('hidden');
                toggleBtn.textContent = 'View Rounds';
            }
        }

        function showCelebration() {
            showLeaderboard();
        }

        function closeCelebration() {
            closeLeaderboard();
        }

        function showError(message, buttonType = 'bank') {
            document.getElementById('error-message').textContent = message;
            const actionButton = document.getElementById('error-action-button');
            
            if (buttonType === 'reset') {
                actionButton.textContent = 'Reset Player';
                actionButton.onclick = resetAndCloseError;
            } else {
                actionButton.textContent = 'Bank it';
                actionButton.onclick = bankAndCloseError;
            }
            
            document.getElementById('error-modal').classList.remove('hidden');
        }

        function closeError() {
            document.getElementById('error-modal').classList.add('hidden');
        }

        function bankAndCloseError() {
            closeError();
            bankRound();
        }

        function resetAndCloseError() {
            closeError();
            const player = getCurrentPlayer();
            if (!player) return;

            player.rounds = [{
                round: 1,
                cards: [],
                selectedCards: new Set(),
                score: 0,
                flip7: false,
                busted: false,
                saved: false
            }];
            player.currentRound = 1;
            player.celebrationShown = false;

            loadRoundSelection();
            
            // Clear all visual selections
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });

            updateDisplay();
            updateRoundsDisplay();
            updatePlayerStrip();
            saveGameState();
        }

        // Share modal functions
        function showShareModal() {
            trackEvent('share_open');
            document.getElementById('share-modal').classList.remove('hidden');
        }

        function closeShareModal() {
            document.getElementById('share-modal').classList.add('hidden');
        }

        function copyLinkToClipboard() {
            var shareUrl = 'https://flip7scorecard.com?utm_source=share&utm_medium=copy_link';
            
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        showSnackbar('Link copied to clipboard! 📋');
                        trackEvent('share_copy_link');
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                        fallbackCopyToClipboard(shareUrl);
                    });
            } else {
                fallbackCopyToClipboard(shareUrl);
            }
        }

        function fallbackCopyToClipboard(text) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showSnackbar('Link copied to clipboard! 📋');
                trackEvent('share_copy_link');
            } catch (err) {
                console.error('Failed to copy:', err);
                showSnackbar('Failed to copy link');
            }
            
            document.body.removeChild(textArea);
        }

        function showSnackbar(message) {
            const snackbar = document.getElementById('snackbar');
            const messageElement = document.getElementById('snackbar-message');
            
            messageElement.textContent = message;
            snackbar.classList.remove('hidden');
            snackbar.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                snackbar.classList.remove('show');
                setTimeout(() => {
                    snackbar.classList.add('hidden');
                }, 300); // Wait for fade out animation
            }, 3000);
        }

        // Ensure these functions are available globally
        window.showShareModal = showShareModal;
        window.closeShareModal = closeShareModal;
        window.copyLinkToClipboard = copyLinkToClipboard;
        
        // Expose multiplayer functions to global scope
        window.switchToPlayer = switchToPlayer;
        window.showPlayerMenu = showPlayerMenu;
        window.closePlayerMenu = closePlayerMenu;
        window.showAddPlayerModal = showAddPlayerModal;
        window.closeAddPlayerModal = closeAddPlayerModal;
        window.confirmAddPlayer = confirmAddPlayer;
        window.showRenamePlayerModal = showRenamePlayerModal;
        window.closeRenamePlayerModal = closeRenamePlayerModal;
        window.confirmRenamePlayer = confirmRenamePlayer;
        window.confirmInlineRename = confirmInlineRename;
        window.showRemovePlayerConfirm = showRemovePlayerConfirm;
        window.closeRemovePlayerModal = closeRemovePlayerModal;
        window.confirmRemovePlayer = confirmRemovePlayer;
        window.showResetConfirmation = showResetConfirmation;
        window.closeResetConfirmation = closeResetConfirmation;
        window.resetAllPlayersAndClose = resetAllPlayersAndClose;
        window.resetEntireGameAndClose = resetEntireGameAndClose;
        window.showLeaderboard = showLeaderboard;
        window.closeLeaderboard = closeLeaderboard;
        window.closeCelebration = closeCelebration;
        window.closeError = closeError;
        window.bankAndCloseError = bankAndCloseError;
        window.resetAndCloseError = resetAndCloseError;
        window.toggleRoundsSection = toggleRoundsSection;
        window.goToPreviousRound = goToPreviousRound;
        window.goToNextRound = goToNextRound;
        window.goToRound = goToRound;
        window.bankRound = bankRound;
        window.bustRound = bustRound;

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