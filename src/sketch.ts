/*
 * Copyright (C) 2023-2024 Brittni Watkins.
 *
 * This file is a part of brittni and the polar bear's Generative Art Library,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */

import P5Lib from 'p5';

import {
    SketchContext,
    Random,
    ColorSelectorManager,
    getAllPaletteColorSelectors,
    ColorSelector,
    Color
} from '@batpb/genart';

import '../assets/styles/sketch.css';

type Shape = 'circle' | 'square';

function sketch(p5: P5Lib): void {
    const gridSize: number = Random.randomInt(4, 40);
    let cellSize: number;
    const xs: number[] = [];
    const ys: number[] = [];
    const types: Shape[] = [];
    const sizes: number[] = [];
    const colors: Color[] = [];
    let background: Color;

    p5.setup = (): void => {
        const canvasSize: number = p5.min(p5.windowWidth, p5.windowHeight);
        p5.createCanvas(canvasSize, canvasSize);
        SketchContext.initialize(p5);
        cellSize = p5.width / gridSize;

        if (Random.randomBoolean()) {
            background = new Color(p5.color(255));
        } else {
            background = new Color(p5.color(0));
        }

        const manager: ColorSelectorManager = new ColorSelectorManager();
        manager.addColorSelectors(getAllPaletteColorSelectors());

        const selector: ColorSelector | undefined = manager.getRandomColorSelector();

        if (selector) {
            console.log(`palette selector = ${selector.hasPalette}`);
            console.log(`selector name = ${selector.name}`);
            console.log(`color names = ${selector.colorNames}`);
        }

        for (let row: number = 0; row < gridSize; row++) {
            for (let col: number = 0; col < gridSize; col++) {
                const x: number = (col * cellSize) + (cellSize / 2.0);
                const y: number = (row * cellSize) + (cellSize / 2.0);
                const size: number = Random.randomFloat(cellSize * 0.5, cellSize * 2);
                const r: boolean = Random.randomBoolean(0.8);
                xs.push(x);
                ys.push(y);
                sizes.push(size);

                if (r) {
                    types.push('circle');
                } else {
                    types.push('square');
                }

                if (selector) {
                    const c: Color = selector.getColor();
                    c.alpha = 180;
                    colors.push(c);
                } else {
                    const c: Color = new Color();
                    c.alpha = 180;
                    colors.push(c);
                }
            }
        }

        p5.rectMode(p5.CENTER);
    }

    p5.draw = () : void => {
        p5.background(background.color);
        for (let i: number = 0; i < gridSize * gridSize; i++) {
            p5.fill(colors[i].color);
            p5.noStroke();

            if (types[i] === 'circle') {
                p5.ellipse(xs[i], ys[i], sizes[i], sizes[i]);
            } else {
                p5.rect(xs[i], ys[i], sizes[i], sizes[i]);
            }

        }
    }
}

new P5Lib(sketch);
