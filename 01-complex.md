---
theme: default
title: Complex numbers
transition: slide-left
class: cover
fonts:
  provider: none
---

<div class="kicker">Linear Algebra · Warsaw University of Technology</div>

# Complex numbers

<div class="subtitle">Lecture 1 · Tomasz Brengos</div>

---
class: section-slide
transition: fade
---

<div class="sec-num">01</div>

<div class="kicker">Section 01</div>

# Motivation

---

# A problem with no real solution

The equation

$$
x^2 + 1 = 0
$$

has no solution in $\R$, since $x^2 \geq 0$ for every real $x$.

<v-click>

The remedy: *extend* the real numbers by one new number

$$
i, \qquad \text{required to satisfy} \qquad i^2 = -1.
$$

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Adjoining $i$ to $\R$ produces the field $\C$ — in which *every* polynomial
equation has a solution. That is where this lecture ends.

</div>

</v-click>

---

# Born of a scandal: the cubic (Italy, 1545)

Historically, nobody extended $\R$ because of $x^2+1=0$ — a quadratic with no
solution was simply *unsolvable*, end of story.

<v-click>

The trouble began with *cubics*. Del Ferro and Tartaglia found a solution
formula, published by Cardano in his *Ars Magna* (1545): the equation
$x^3 = px + q$ is solved by

$$
x = \sqrt[3]{\tfrac{q}{2} + \sqrt{\tfrac{q^2}{4} - \tfrac{p^3}{27}}}
  + \sqrt[3]{\tfrac{q}{2} - \sqrt{\tfrac{q^2}{4} - \tfrac{p^3}{27}}}.
$$

</v-click>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

Try it on $x^3 = 15x + 4$. The formula demands
$x = \sqrt[3]{2 + \sqrt{-121}} + \sqrt[3]{2 - \sqrt{-121}}$ — a square root of
a *negative* number. Yet $x = 4$ plainly solves the equation:
$64 = 60 + 4$. The formula is right, and it is speaking a language nobody
understood yet.

</div>

</v-click>

<!--
Key historical point: complex numbers were forced on us by cubics with perfectly real roots — not by quadratics.
-->

---

# Bombelli's wild thought (1572)

Rafael Bombelli had no theory of complex numbers — no definition, no $i$.
His idea (``a wild thought'', he admitted): treat the *meaningless
symbol* $\sqrt{-1}$ as if it were a number, obey every ordinary rule of
algebra, and add one bookkeeping rule: $(\sqrt{-1})^2 = -1$.

<v-click>

<StepThrough :steps="['\\left(2+\\sqrt{-1}\\right)^3 = 8 + 12\\sqrt{-1} + 6\\left(\\sqrt{-1}\\right)^2 + \\left(\\sqrt{-1}\\right)^3', '= 8 + 12\\sqrt{-1} - 6 - \\sqrt{-1} = 2 + 11\\sqrt{-1} = 2 + \\sqrt{-121}', '\\sqrt[3]{2 + \\sqrt{-121}} = 2 + \\sqrt{-1},   \\sqrt[3]{2 - \\sqrt{-121}} = 2 - \\sqrt{-1}', 'x = \\left(2 + \\sqrt{-1}\\right) + \\left(2 - \\sqrt{-1}\\right) = 4']" :captions="['expand the cube by the binomial rule — pure symbol pushing', 'apply the bookkeeping rule twice', 'the same for the other cube root', 'the symbols cancel — and the answer is checkable']" />

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

The symbol entered the computation, cancelled out, and delivered the honest,
verifiable answer $4$ — with no claim about what $\sqrt{-1}$ *is*.
That claim is a debt, and this lecture pays it: our definition of $\C$ is
precisely the licence for Bombelli's game.

</div>

</v-click>

---

# Two centuries of suspicion

<v-clicks>

- **1637** — Descartes dismisses the new numbers as *imaginary*;
  the insult sticks and becomes the official name.
- **1748** — Euler connects them to trigonometry:
  $e^{i\varphi} = \cos\varphi + i\sin\varphi$; in **1777** he introduces the
  symbol $i$.
- **1797 / 1806** — Wessel and Argand independently draw complex
  numbers as *points of the plane*.
- **1831** — Gauss champions the planar picture, coins the name
  *complex numbers*, and the suspicion finally dies.
- **1833** — Hamilton gives the modern definition: pairs $(a,b)$ of
  real numbers. Ten years later his quaternions — a 4-dimensional cousin of
  $\C$ — end up rotating every 3D game world you have played in.

</v-clicks>

<v-click>

Today's lecture follows the same arc: calculate first, then draw the plane —
in one lecture instead of three hundred years.

</v-click>

---

# You have used complex numbers today

<v-clicks>

- **Multimedia.** Every JPEG, MP3 and video call runs on the Fast Fourier
  Transform — arithmetic of the *roots of unity* we compute today.
- **Graphics and games.** Multiplying by a complex number of modulus $1$
  *rotates* the plane; one dimension up, quaternions rotate every 3D game world.
- **Quantum computing.** A qubit is a pair of complex numbers; quantum
  interference is addition of complex numbers with different arguments.
- **Fractals.** The Mandelbrot set is the iteration $z \mapsto z^2 + c$,
  coloured by how fast $|z| \to \infty$.

</v-clicks>

<!--
Sell the chapter: FFT and rotations are the two examples to come back to later.
-->

---
class: section-slide
transition: fade
---

<div class="sec-num">02</div>

<div class="kicker">Section 02</div>

# The complex numbers

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

A *complex number* is an expression $a + bi$, where $a, b \in \R$.
The set of all complex numbers is denoted by $\C$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Formally a complex number is just the pair $(a,b) \in \R \times \R$: the symbol $i$
denotes $(0,1)$, and nothing is being ``imagined'' — $\C$ is the plane $\R^2$
equipped with a multiplication.

</div>

</v-click>

---

# Arithmetic

<div class="thm def">

<span class="lbl">Definition</span>

$$
(a+bi) + (c+di) = (a+c) + (b+d)i, \qquad
(a+bi)(c+di) = (ac - bd) + (ad + bc)i.
$$

</div>

The product rule is what formal expansion gives, using $i^2 = -1$:

<v-click>

<StepThrough :steps="['(2+3i)(1-2i) = 2 - 4i + 3i - 6i^2', '= 2 - i + 6', '= 8 - i']" :captions="['expand formally', 'use i^2 = -1', 'collect']" />

</v-click>

---

# Division

<div class="thm rem">

<span class="lbl">Fact</span>

For any complex number, $(a+bi)(a-bi) = a^2 + b^2$ — a real number.
Hence every $z \neq 0$ has a multiplicative inverse.

</div>

<v-click>

<StepThrough :steps="['\\frac{1}{1+i} = \\frac{1-i}{(1+i)(1-i)}', '= \\frac{1-i}{2} = \\tfrac12 - \\tfrac12\\, i']" :captions="['multiply by the conjugate', 'the denominator became real']" />

</v-click>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

$\C$ with these operations is a *field*: all rules of arithmetic
familiar from $\Q$ and $\R$ hold. (Fields are the subject of the next lecture.)

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">03</div>

<div class="kicker">Section 03</div>

# The complex plane

---

# A number is a point

<div class="cols">

<div>

A complex number $z = a + bi$ *is* a point of the plane.

Its length is the *modulus*

$$
|z| = \sqrt{a^2 + b^2},
$$

and the angle to the positive real axis is the *argument* $\arg(z)$.

**Drag the point.**

</div>

<div>

<div class="widget"><CPlane :re="2" :im="1.5" /></div>

</div>

</div>

---

# Conjugation is reflection

<div class="cols">

<div>

<div class="thm def">

<span class="lbl">Definition</span>

The *conjugate* of $z = a+bi$ is $\bar z = a - bi$.

</div>

<div class="thm rem">

<span class="lbl">Fact</span>

$z \bar z = |z|^2$,   $\Re(z) = \tfrac12(z + \bar z)$,  
$\overline{z+w} = \bar z + \bar w$,   $\overline{zw} = \bar z\, \bar w$.

</div>

Geometrically: reflection across the real axis.

</div>

<div>

<div class="widget"><CPlane :re="2" :im="1.5" :showConj="true" :showPolar="false" /></div>

</div>

</div>

---

# Moduli measure distance

<div class="thm rem">

<span class="lbl">Fact</span>

$|z - w|$ is the distance between the points $z$ and $w$, and the
*triangle inequality* holds: $|z+w| \leq |z| + |w|$.

</div>

<v-click>

<div class="cols">

<div>

Conditions on moduli describe geometric figures:

$$
\{\, z \in \C \mid |z - z_0| = r \,\}
$$

is the *circle* of radius $r$ centred at $z_0$.

For $z_0 = 0$ this is $|z| = r$, centred at the origin. A general $z_0$
shifts the centre — mind the signs: $|z + 1 - i| = |z - (-1+i)|$ is centred
at $-1+i$, *not* at $1-i$.

Drag $z$ onto the dashed circle: the distance $|z - z_0|$ hits $1.5$.

</div>

<div>

<div class="widget"><CPlane :re="0.5" :im="1" :circleRe="-1" :circleIm="1" :circleR="1.5" :showPolar="false" /></div>

</div>

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">04</div>

<div class="kicker">Section 04</div>

# Polar form

---

# The argument, precisely

<div class="thm def">

<span class="lbl">Definition</span>

For $z \neq 0$, an *argument* of $z$ is any angle $\varphi$ with

$$
\cos\varphi = \frac{a}{|z|}, \qquad \sin\varphi = \frac{b}{|z|}.
$$

The argument in $(-\pi, \pi]$ is the *principal* argument.
By convention $\arg(0) = 0$.

</div>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

$\tan\varphi = \tfrac{b}{a}$ alone does *not* determine $\varphi$: always
check the quadrant. For $z = -1 + i$ the argument is $\tfrac{3\pi}{4}$,
not $-\tfrac{\pi}{4}$.

</div>

</v-click>

---

# Polar form

<div class="thm theo">

<span class="lbl">Theorem</span>

Every $z \in \C$ can be written as

$$
z = |z| \left( \cos\varphi + i \sin\varphi \right), \qquad \varphi = \arg(z).
$$

For $z = 0$ both sides are $0$ whatever the angle — which is why the
convention $\arg(0) = 0$ costs nothing.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$z = 1 + i$: modulus $|z| = \sqrt2$, argument $\tfrac{\pi}{4}$, so

$$
1 + i = \sqrt2 \left( \cos\tfrac{\pi}{4} + i \sin\tfrac{\pi}{4} \right).
$$

</div>

</v-click>

---

# Multiplication is rotation and scaling

<div class="thm theo">

<span class="lbl">Theorem</span>

$z_1 z_2 = |z_1||z_2| \big( \cos(\varphi_1 + \varphi_2) + i \sin(\varphi_1 + \varphi_2) \big)$
— *moduli multiply, arguments add*.

</div>

<div class="widget"><ComplexMul  /></div>

<!--
Let students drag w onto the unit circle: pure rotation, the heart of computer graphics.
-->

---

# De Moivre's formula

<div class="thm theo">

<span class="lbl">Theorem</span>

If $z = |z|(\cos\varphi + i\sin\varphi)$ and $n \in \N$, then
$z^n = |z|^n \big( \cos(n\varphi) + i \sin(n\varphi) \big)$.

</div>

<v-click>

<StepThrough :steps="['(1+i)^{100} = \\left(\\sqrt2\\right)^{100} \\left( \\cos\\tfrac{100\\pi}{4} + i \\sin\\tfrac{100\\pi}{4} \\right)', '= 2^{50} \\left( \\cos 25\\pi + i \\sin 25\\pi \\right)', '= 2^{50} (\\cos\\pi + i\\sin\\pi) = -2^{50}']" :captions="['polar form of 1+i', 'De Moivre', 'angles live modulo 2 pi']" />

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">05</div>

<div class="kicker">Section 05</div>

# Roots

---

# Every number has n distinct n-th roots

<div class="thm theo">

<span class="lbl">Theorem</span>

For $z = |z|(\cos\varphi + i\sin\varphi) \neq 0$, the solutions of $w^n = z$ are

$$
w_k = \sqrt[n]{|z|} \left( \cos\tfrac{\varphi + 2k\pi}{n} + i \sin\tfrac{\varphi + 2k\pi}{n} \right),
\qquad k = 0, 1, \ldots, n-1.
$$

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

The $n$ roots lie on a circle of radius $\sqrt[n]{|z|}$ and cut it into $n$
equal arcs — a regular $n$-gon.

</div>

</v-click>

---

# Roots of unity

<div class="cols">

<div>

Taking $z = 1$: the $n$-th *roots of unity*

$$
z_k = \cos\tfrac{2k\pi}{n} + i \sin\tfrac{2k\pi}{n}.
$$

Multiplying by $z_1$ rotates the polygon by one step — press the button.

These numbers drive the Fast Fourier Transform.

</div>

<div>

<div class="widget"><RootsOfUnity :n="6" /></div>

</div>

</div>

---

# Example: the square roots of 2i

<StepThrough :steps="['2i = 2 \\left( \\cos\\tfrac{\\pi}{2} + i \\sin\\tfrac{\\pi}{2} \\right)', 'w_0 = \\sqrt2 \\left( \\cos\\tfrac{\\pi}{4} + i \\sin\\tfrac{\\pi}{4} \\right) = 1 + i', 'w_1 = \\sqrt2 \\left( \\cos\\tfrac{5\\pi}{4} + i \\sin\\tfrac{5\\pi}{4} \\right) = -1 - i']" :captions="['write 2i in polar form', 'k = 0', 'k = 1']" />

<v-click>

Check: $(1+i)^2 = 1 + 2i + i^2 = 2i$. ✓

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">06</div>

<div class="kicker">Section 06</div>

# Polynomials

---

# The Fundamental Theorem of Algebra

<div class="thm theo">

<span class="lbl">Theorem</span>

Every polynomial $f \in \C[x]$ with $\deg(f) \geq 1$ has a root in $\C$.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Corollary</span>

Every such $f$ factors completely into linear factors:

$$
f(x) = a (x - z_1)^{k_1} \cdots (x - z_m)^{k_m}.
$$

</div>

</v-click>

<v-click>

This is why we extended $\R$ in the first place: over $\C$, polynomial
equations always have solutions — the extension is *complete*.

</v-click>

---

# Quadratic equations over C

<div class="thm theo">

<span class="lbl">Theorem</span>

For $f(x) = ax^2 + bx + c$ with $a \neq 0$, the roots are
$z_{0,1} = \frac{-b \mp \delta}{2a}$, where $\delta$ is any square root of
$\Delta = b^2 - 4ac$.

</div>

<v-click>

<StepThrough :steps="['x^2 + 2x + 5:   \\Delta = 4 - 20 = -16,   \\delta = 4i', 'z_{0,1} = \\frac{-2 \\mp 4i}{2} = -1 \\mp 2i']" :captions="['negative discriminant is no obstacle', 'conjugate pair']" />

</v-click>

---

# Real polynomials and conjugate roots

<div class="thm theo">

<span class="lbl">Theorem</span>

If $f \in \R[x]$ and $f(z) = 0$, then also $f(\bar z) = 0$: non-real roots of
real polynomials come in conjugate pairs.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Corollary</span>

Every real polynomial factors into real linear factors and real quadratic
factors with $\Delta < 0$.

</div>

</v-click>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$x^4 - 16 = (x-2)(x+2)(x^2+4)$ over $\R$; over $\C$ the last factor splits
into $(x-2i)(x+2i)$ — a conjugate pair.

</div>

</v-click>

---

# Summary

<v-clicks>

- $\C$ = the plane with a multiplication; $i^2 = -1$; conjugate and modulus.
- Polar form: multiplication *rotates and scales*; De Moivre computes powers.
- Every $z \neq 0$ has exactly $n$ $n$-th roots — a regular $n$-gon.
- Fundamental Theorem of Algebra: over $\C$, polynomials factor completely.
- **Next lecture:** what exactly is a *field*? Groups, fields, and
  arithmetic modulo $p$.

</v-clicks>
